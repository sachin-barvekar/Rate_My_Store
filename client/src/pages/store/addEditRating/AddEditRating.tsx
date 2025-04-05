import React, { useMemo } from 'react'
import { Button, ButtonToolbar, Col, Rate } from 'rsuite'
import { Formik, Form, FormikHelpers, FormikProps } from 'formik'
import { Modal, Panel, Row, Section, FormikErrorMessage } from '../../../shared'
// import { notifySuccess } from '../../../utils'
import '../../../scss/common/forms/Form.scss'
import { Store } from '../types'
import {
  defaultStoreFormValues,
  getInitialStoreFormValueFromResponse,
  IStoreForm,
  STORE_FORM_FIELDS,
  storeValidationSchema,
} from '../utils'
import useAuth from '../../../hooks/Auth'
import { useUpdateStoreRatingMutation } from '../storeApiSlice'
import { notifySuccess } from '../../../utils'

type Props = {
  isOpen: boolean
  onClose: () => void
  ratingData?: Store
}

const AddEditRating: React.FC<Props> = ({ isOpen, onClose, ratingData }) => {
  const { STORE_RATING } = STORE_FORM_FIELDS
  const { user } = useAuth()
  const userId = user?._id
  const initialValues = useMemo(() => {
    return ratingData
      ? getInitialStoreFormValueFromResponse(ratingData)
      : defaultStoreFormValues
  }, [ratingData])

  const [updateRating] = useUpdateStoreRatingMutation()

  const onSubmit = async (
    formValues: IStoreForm,
    { setSubmitting }: FormikHelpers<IStoreForm>,
  ) => {
    try {
      const response = await updateRating({
        id: ratingData?._id ?? '',
        store: formValues,
      })

      if (response?.data) {
        notifySuccess('Store Rating updated successfully!')
      }

      onClose()
    } catch (error) {
      console.error('Failed to process rating request.', error)
    } finally {
      setSubmitting(false)
    }
  }

  const renderFormButtons = (formikProps: FormikProps<IStoreForm>) => (
    <ButtonToolbar>
      <Button appearance='ghost' onClick={onClose}>
        Close
      </Button>
      <Button
        type='submit'
        appearance='primary'
        disabled={formikProps.isValidating || formikProps.isSubmitting}>
        Save
      </Button>
    </ButtonToolbar>
  )

  return (
    <Modal
      secondary
      open={isOpen}
      onClose={onClose}
      title='Update Store Rating'
      size='xs'
      body={
        <Formik
          initialValues={initialValues}
          validationSchema={storeValidationSchema()}
          onSubmit={onSubmit}
          enableReinitialize>
          {(formikProps: FormikProps<IStoreForm>) => (
            <Form className='create-edit-form'>
              <Panel bordered={false}>
                <Section title={`Store Rating for ${ratingData?.name}`}>
                  <Row>
                    <Col xs={24}>
                      <center>
                        <Rate
                          color='yellow'
                          defaultValue={
                            typeof initialValues.rating === 'number'
                              ? initialValues.rating
                              : 0
                          }
                          size='lg'
                          onChange={value =>
                            formikProps.setFieldValue(STORE_RATING, {
                              [userId ?? 'unknownUser']: value,
                            })
                          }
                        />
                      </center>
                      <FormikErrorMessage name={STORE_RATING} />
                    </Col>
                  </Row>
                </Section>
                <div className='form-button'>
                  {renderFormButtons(formikProps)}
                </div>
              </Panel>
            </Form>
          )}
        </Formik>
      }
    />
  )
}

export default AddEditRating
