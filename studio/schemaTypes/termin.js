import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'termin',
  title: 'Termín',
  type: 'document',
  fields: [
    defineField({
      name: 'city',
      title: 'Město',
      type: 'string',
      options: {
        list: [
          {title: 'Liberec', value: 'Liberec'},
          {title: 'Jablonec nad Nisou', value: 'Jablonec nad Nisou'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Místo',
      type: 'string',
      description: 'Například ZŠ Aloisina výšina, Liberec',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'startDate',
      title: 'Od',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'Do',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Cena (Kč)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'headline',
      title: 'Nadpis',
      type: 'string',
      description: 'Například 🍂 Podzimní prázdniny 🍂',
    }),
    defineField({
      name: 'included',
      title: 'V ceně',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'formspreeId',
      title: 'Formspree ID',
      type: 'string',
      description:
        'Nech prázdné, pokud má termín používat společnou přihlášku z nastavení (moeevgno). Vyplň jen když má mít vlastní formulář.',
    }),
  ],
  preview: {
    select: {city: 'city', location: 'location', startDate: 'startDate', endDate: 'endDate'},
    prepare({city, location, startDate, endDate}) {
      return {
        title: city || 'Termín',
        subtitle: [location, startDate && endDate ? `${startDate} – ${endDate}` : '']
          .filter(Boolean)
          .join(' · '),
      }
    },
  },
})
