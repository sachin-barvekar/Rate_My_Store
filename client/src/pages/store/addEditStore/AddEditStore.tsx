import React, { useMemo } from 'react'
import { Button, ButtonToolbar, Col } from 'rsuite'
import { Formik, Form, FormikHelpers, FormikProps } from 'formik'
import {
  Modal,
  Panel,
  Row,
  Section,
  TextInput,
  SelectDropdown,
  FormikErrorMessage,
} from '../../../shared'
import {
  defaultStoreFormValues,
  storeValidationSchema,
  IStoreForm,
  STORE_FORM_FIELDS,
  getInitialStoreFormValueFromResponse,
} from '../../store/utils'
import { notifySuccess } from '../../../utils'
import '../../../scss/common/forms/Form.scss'
import { Store } from '../types'
import {
  useCreateStoreMutation,
  useUpdateStoreMutation,
} from '../storeApiSlice'
import { useFetchUserListQuery } from '../../users/userListApiSlice'
import { User } from '../../../contexts/types'
import { IListApiRequest, Operator } from '../../../api/types'
import { useTableHandlers } from '../../../hooks/useTableHandlers'

type Props = {
  isOpen: boolean
  onClose: () => void
  storeData?: Store
  isEditMode: boolean
}

const AddEditStore: React.FC<Props> = ({
  isOpen,
  onClose,
  storeData,
  isEditMode,
}) => {
  const { NAME, EMAIL, STORE_OWNER, ADDRESS } = STORE_FORM_FIELDS

  const initialValues = useMemo(() => {
    return storeData
      ? getInitialStoreFormValueFromResponse(storeData)
      : defaultStoreFormValues
  }, [storeData])

  const [createStore] = useCreateStoreMutation()
  const [updateStore] = useUpdateStoreMutation()

  const { requestBody: userRequestBody } = useTableHandlers<
    User,
    IListApiRequest<User>
  >({
    filters: [
      {
        fieldName: 'role',
        operator: Operator.EQ,
        fieldValue: 'store_owner',
      },
    ],
  })
  const { data: store_owner } = useFetchUserListQuery(userRequestBody)
  const storeOwners =
    store_owner?.content?.map(user => ({
      label: user.name,
      value: user._id,
    })) || []

  const onSubmit = async (
    formValues: IStoreForm,
    { setSubmitting }: FormikHelpers<IStoreForm>,
  ) => {
    try {
      if (isEditMode && storeData?._id) {
        const response = await updateStore({
          id: storeData._id,
          store: formValues,
        })
        if (response.data) {
          notifySuccess('Store updated successfully!')
        }
      } else {
        const response = await createStore(formValues)
        if (response.data) {
          notifySuccess('Store created successfully!')
        }
      }
      onClose()
    } catch (error) {
      console.error('Failed to process store request.', error)
    } finally {
      setSubmitting(false)
    }
  }

  const renderFormButtons = (formikProps: FormikProps<IStoreForm>) => (
    <ButtonToolbar>
      <Button appearance='ghost' onClick={() => formikProps.resetForm()}>
        Reset
      </Button>
      <Button
        type='submit'
        appearance='primary'
        disabled={formikProps.isValidating || formikProps.isSubmitting}>
        {isEditMode ? 'Save Changes' : 'Save'}
      </Button>
    </ButtonToolbar>
  )

  return (
    <Modal
      secondary
      open={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Store' : 'Add Store'}
      size='md'
      body={
        <Formik
          initialValues={initialValues}
          validationSchema={storeValidationSchema()}
          onSubmit={onSubmit}
          enableReinitialize>
          {(formikProps: FormikProps<IStoreForm>) => (
            <Form className='create-edit-form'>
              <Panel bordered={false}>
                <Section title='Store Details'>
                  <Row>
                    <Col xs={12}>
                      <TextInput
                        formik={formikProps}
                        name={NAME}
                        placeholder='Enter store name'
                      />
                      <FormikErrorMessage name={NAME} />
                    </Col>
                    <Col xs={12}>
                      <TextInput
                        formik={formikProps}
                        name={EMAIL}
                        placeholder='Enter store email'
                      />
                      <FormikErrorMessage name={EMAIL} />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <SelectDropdown
                        name={STORE_OWNER}
                        data={storeOwners ?? []}
                        placeholder='Select Store Owner'
                        value={formikProps.values[STORE_OWNER]}
                        onChange={value =>
                          formikProps.setFieldValue(STORE_OWNER, value)
                        }
                      />
                      <FormikErrorMessage name={STORE_OWNER} />
                    </Col>
                    <Col xs={12}>
                      <TextInput
                        formik={formikProps}
                        name={ADDRESS}
                        placeholder='Enter store address'
                      />
                      <FormikErrorMessage name={ADDRESS} />
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

export default AddEditStore
