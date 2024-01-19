import { faker } from '@faker-js/faker';
import { PrismaClient, Product } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();
const createProduct = async (quantity: number) => {
  const products: Product[] = [];
  for (let i = 0; i < quantity; i++) {
    const productName = faker.commerce.productName();
    const categoryName = faker.commerce.department();
    const product = await prisma.product.create({
      data: {
        name: productName,
        slug: faker.helpers.slugify(productName),
        description: faker.commerce.productDescription(),
        price: +faker.commerce.price({ min: 10, max: 999, dec: 0 }),
        user: { connect: { id: 1 } },
        images: Array.from({
          length: faker.number.int({ min: 2, max: 4 }),
        }).map((item) => {
          return faker.image.urlPicsumPhotos();
        }),
        category: {
          create: {
            name: categoryName,
            slug: faker.helpers.slugify(categoryName),
          },
        },
        reviews: {
          create: [
            {
              user: { connect: { id: 1 } },
              rating: faker.number.int({ min: 1, max: 5 }),
              text: faker.commerce.productDescription(),
            },
            {
              user: { connect: { id: 1 } },
              rating: faker.number.int({ min: 1, max: 5 }),
              text: faker.commerce.productDescription(),
            },
          ],
        },
      },
    });
    console.log(product);
    products.push(product);
  }
  console.log(`created ${products.length} prods`);
};

async function main() {
  await createProduct(10);
}
main()
  .catch((e) => console.log(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
