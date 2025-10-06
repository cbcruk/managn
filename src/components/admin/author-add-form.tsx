'use client'

import { FormLayout, FormLayoutField } from '@components/form/form-layout'
import { Input } from '@components/ui/input'
import { Button } from '@components/ui/button'
import { Label } from '@components/ui/label'
import type { Author } from 'db/schema'

type AuthorAddFormProps = {
  data?: Author
}

export function AuthorAddForm({ data }: AuthorAddFormProps) {
  return (
    <FormLayout>
      {data?.id && <input type="hidden" name="id" defaultValue={data.id} />}
      <FormLayout.FieldGroup>
        <FormLayoutField>
          <FormLayoutField.Label>
            <Label htmlFor="name_ko">한국어</Label>
          </FormLayoutField.Label>
          <FormLayoutField.Body>
            <Input
              type="text"
              id="name_ko"
              name="name_ko"
              defaultValue={data?.name_ko}
              required
            />
          </FormLayoutField.Body>
        </FormLayoutField>

        <FormLayoutField>
          <FormLayoutField.Label>
            <Label htmlFor="name_ja">일본어</Label>
          </FormLayoutField.Label>
          <FormLayoutField.Body>
            <Input
              type="text"
              id="name_ja"
              name="name_ja"
              defaultValue={data?.name_ja}
              required
            />
          </FormLayoutField.Body>
        </FormLayoutField>
      </FormLayout.FieldGroup>

      <FormLayout.Footer>
        <Button type="submit" className="flex-1">
          저장
        </Button>
      </FormLayout.Footer>
    </FormLayout>
  )
}
