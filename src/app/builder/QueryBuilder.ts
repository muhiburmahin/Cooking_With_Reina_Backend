import { TQueryObj } from "../interfaces";

class QueryBuilder {
  public query: TQueryObj;

  constructor(query: TQueryObj) {
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = this.query?.searchTerm;
    if (searchTerm) {
      return {
        OR: searchableFields.map((field) => {
          if (field.includes('.')) {
            const [relation, nestedField] = field.split('.');
            return {
              [relation as string]: {
                [nestedField as string]: { contains: searchTerm, mode: 'insensitive' }
              }
            };
          }
          return {
            [field]: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          };
        }),
      };
    }
    return {};
  }

  filter() {
    const queryObj = { ...this.query };
    const excludeFields = ['searchTerm', 'page', 'limit', 'sortBy', 'sortOrder', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    const filters: any = {};

    Object.keys(queryObj).forEach((key) => {
      const value = queryObj[key];

      // কাস্টম রেঞ্জ ফিল্টার (Price, Calories etc)
      if (key === 'minPrice' || key === 'maxPrice' || key === 'minCalories' || key === 'maxCalories') {
        const field = key.toLowerCase().includes('price') ? 'price' : 'calories';
        const operator = key.startsWith('min') ? 'gte' : 'lte';
        filters[field] = { ...filters[field], [operator]: Number(value) };
      } 
      else if (key === 'tags' || key === 'ingredients') {
        const tagsArray = (value as string).split(',');
        filters[key === 'tags' ? 'dietaryTags' : 'ingredients'] = {
          hasEvery: tagsArray, 
        };
      }
      else {
        filters[key] = value;
      }
    });

    return filters;
  }

  sort() {
    const sortBy = (this.query?.sortBy as string) || 'createdAt';
    const sortOrder = (this.query?.sortOrder as 'asc' | 'desc') || 'desc';
    
    if (sortBy.includes('.')) {
        const [relation, field] = sortBy.split('.');
        return { [relation as string]: { [field as string]: sortOrder } };
    }

    return { [sortBy as string]: sortOrder };
  }
 
  paginate() {
    const page = Math.max(Number(this.query?.page) || 1, 1);
    const limit = Math.max(Number(this.query?.limit) || 10, 1);
    const skip = (page - 1) * limit;

    return {
      take: limit,
      skip: skip,
    };
  }

  fields() {
    const fieldsString = this.query?.fields as string;
    if (fieldsString) {
      const selectObj: Record<string, boolean> = {};
      fieldsString.split(',').forEach((field) => {
        selectObj[field.trim()] = true;
      });
      selectObj['id'] = true; 
      return selectObj;
    }
    return undefined;
  }
}

export default QueryBuilder;