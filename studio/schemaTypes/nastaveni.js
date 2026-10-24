import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'nastaveni',
  title: 'Přihláška (Formspree)',
  type: 'document',
  fields: [
    defineField({
      name: 'formspreeId',
      title: 'Formspree ID přihlášky',
      type: 'string',
      description:
        'ID z adresy formuláře, například moeevgno z https://formspree.io/f/moeevgno. Každý termín ho použije, pokud u něj nevyplníš jiné ID.',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
