import { FocusCards } from './focus-cards'

interface Category {
  name: string
  count: string
  src: string
  icon: React.JSX.Element
}

interface CategorySectionProps {
  categories: Category[]
}

export function CategorySection({ categories }: CategorySectionProps) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
      <FocusCards cards={categories} />
    </section>
  )
}
