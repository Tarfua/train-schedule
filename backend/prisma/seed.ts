import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('Починаю наповнення бази даних станціями...');

  try {
    // Спроба очистити таблицю
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "stations" RESTART IDENTITY CASCADE');
    console.log('Таблицю stations очищено');
  } catch (error) {
    console.log('Не вдалося очистити таблицю stations:', error);
  }

  // Масив станцій української залізниці
  const stations = [
    { name: 'Київ-Пасажирський', city: 'Київ' },
    { name: 'Харків-Пасажирський', city: 'Харків' },
    { name: 'Львів', city: 'Львів' },
    { name: 'Одеса-Головна', city: 'Одеса' },
    { name: 'Дніпро-Головний', city: 'Дніпро' },
    { name: 'Запоріжжя-1', city: 'Запоріжжя' },
    { name: 'Вінниця', city: 'Вінниця' },
    { name: 'Полтава-Київська', city: 'Полтава' },
    { name: 'Суми', city: 'Суми' },
    { name: 'Чернігів', city: 'Чернігів' },
    { name: 'Івано-Франківськ', city: 'Івано-Франківськ' },
    { name: 'Ужгород', city: 'Ужгород' },
    { name: 'Тернопіль', city: 'Тернопіль' },
    { name: 'Хмельницький', city: 'Хмельницький' },
    { name: 'Житомир', city: 'Житомир' },
    { name: 'Чернівці', city: 'Чернівці' },
    { name: 'Рівне', city: 'Рівне' },
    { name: 'Луцьк', city: 'Луцьк' },
    { name: 'Черкаси', city: 'Черкаси' },
    { name: 'Кропивницький', city: 'Кропивницький' },
    { name: 'Херсон', city: 'Херсон' },
    { name: 'Миколаїв', city: 'Миколаїв' },
    { name: 'Ворохта', city: 'Ворохта' },
    { name: 'Кременчук', city: 'Кременчук' },
    { name: 'Костянтинівка', city: 'Костянтинівка' },
    { name: 'Краматорськ', city: 'Краматорськ' },
    { name: 'Покровськ', city: 'Покровськ' },
    { name: "Слов'янськ", city: "Слов'янськ" },
    { name: 'Бахмут', city: 'Бахмут' },
    { name: 'Ясіня', city: 'Ясіня' },
    { name: 'Рахів', city: 'Рахів' }
  ];

  let addedCount = 0;
  
  // Додаємо кожну станцію окремо через безпечний метод
  for (const station of stations) {
    try {
      await prisma.$executeRawUnsafe(
        `INSERT INTO "stations" (id, name, city, created_at, updated_at) 
         VALUES (gen_random_uuid(), $1, $2, NOW(), NOW())`,
        station.name,
        station.city
      );
      addedCount++;
    } catch (error) {
      console.log(`Помилка при додаванні станції ${station.name}:`, error);
    }
  }
  
  console.log(`Додано ${addedCount} станцій до бази даних.`);
}

main()
  .catch((e) => {
    console.error('Помилка під час наповнення бази даних:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 