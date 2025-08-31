import { ErrorBoundary } from 'react-error-boundary'
import { AuthorAddFormAction } from './author-add-form-action'
import { FormLayout, FormLayoutField } from '@components/form/form-layout'
import { Input } from '@components/ui/input'
import { Button } from '@components/ui/button'
import { FormAlert } from '@components/form/form-alert'
import { Label } from '@components/ui/label'

export function AuthorAddForm() {
  return (
    <ErrorBoundary FallbackComponent={FormAlert}>
      <AuthorAddFormAction>
        {({ pending }) => (
          <FormLayout>
            <FormLayout.Title>작가 추가</FormLayout.Title>

            <FormLayout.FieldGroup>
              <FormLayoutField>
                <FormLayoutField.Label>
                  <Label htmlFor="name_ko">한국어</Label>
                </FormLayoutField.Label>
                <FormLayoutField.Body>
                  <Input type="text" id="name_ko" name="name_ko" required />
                </FormLayoutField.Body>
              </FormLayoutField>

              <FormLayoutField>
                <FormLayoutField.Label>
                  <Label htmlFor="name_ja">일본어</Label>
                </FormLayoutField.Label>
                <FormLayoutField.Body>
                  <Input type="text" id="name_ja" name="name_ja" required />
                </FormLayoutField.Body>
              </FormLayoutField>
            </FormLayout.FieldGroup>

            <FormLayout.Footer>
              <Button type="submit" className="flex-1" disabled={pending}>
                작가 추가
              </Button>
            </FormLayout.Footer>
          </FormLayout>
        )}
      </AuthorAddFormAction>
    </ErrorBoundary>
  )
}
