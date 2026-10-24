import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'supersportaci',
  title: 'Super sporťáci',
  projectId: 'bong2fyb',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Obsah')
          .items([
            S.listItem()
              .title('Přihláška (Formspree)')
              .id('nastaveni')
              .child(S.document().schemaType('nastaveni').documentId('nastaveni')),
            S.listItem()
              .title('Termíny')
              .child(S.documentTypeList('termin').title('Termíny')),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter((template) => template.schemaType !== 'nastaveni'),
  },
})
