import { type SchemaTypeDefinition } from 'sanity'
import banner from './banner'
import product from './product'
import category from './category'
import order from './order'
import user from './user'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [banner, product, category, order, user],
}
export default schema