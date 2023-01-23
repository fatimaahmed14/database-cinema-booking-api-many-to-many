const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seed() {
  await createCustomer();
  const movies = await createMovies();
  const screens = await createScreens();
  await createScreenings(screens, movies);
  // const seating = await createSeating();
  // const ticketWithSeating = await createTicketWitSeating();

  process.exit(0);
}

async function createCustomer() {
  const customer = await prisma.customer.create({
    data: {
      name: "Alice",
      contact: {
        create: {
          email: "alice@boolean.co.uk",
          phone: "1234567890",
        },
      },
    },
    include: {
      contact: true,
    },
  });

  console.log("Customer created", customer);

  return customer;
}

async function createMovies() {
  const rawMovies = [
    { title: "The Matrix", runtimeMins: 120 },
    { title: "Dodgeball", runtimeMins: 154 },
  ];

  const movies = [];

  for (const rawMovie of rawMovies) {
    const movie = await prisma.movie.create({ data: rawMovie });
    movies.push(movie);
  }

  console.log("Movies created", movies);

  return movies;
}

async function createScreens() {
  const rawScreens = [{ number: 1 }, { number: 2 }];

  const screens = [];

  for (const rawScreen of rawScreens) {
    const screen = await prisma.screen.create({
      data: rawScreen,
    });

    const seats = [];

    for (let i = 0; i < 5; i++) {
      const seat = await prisma.seat.create({
        data: {
          screenId: screen.id
        }
      });

      seats.push(seat);
    }
    console.log("Screen created", screen);
    screen.seats = seats;
    screens.push(screen);
  }

  return screens;
}

async function createScreenings(screens, movies) {
  const screeningDate = new Date();

  for (const screen of screens) {
    for (let i = 0; i < movies.length; i++) {
      screeningDate.setDate(screeningDate.getDate() + i);

      const screening = await prisma.screening.create({
        data: {
          startsAt: screeningDate,
          movie: {
            connect: {
              id: movies[i].id,
            },
          },
          screen: {
            connect: {
              id: screen.id,
            },
          },
        },
      });

      console.log("Screening created", screening);
    }
  }
}

// async function createSeating(screen) {
//   const rawSeats = [
//     {
//       seatNum: "G06",
//       screen: {
//         connect: {
//           id: 1,
//         },
//       },
//     },
//     {
//       seatNum: "H12",
//       screen: {
//         connect: {
//           id: 2,
//         },
//       },
//     },
//   ];

//   const seats = [];

//   for (const rawSeat of rawSeats) {
//     const seat = await prisma.seating.create({ data: rawSeat });
//     seating.push(seat);
//   }

//   console.log("Seating created", seating);

//   return seats;
// }

// async function createTicketWitSeating() {
//   const ticketWithSeating = await prisma.ticket.create({
//     data: {
//       screening: {
//         connect: {
//           id: 1,
//         },
//       },
//       customer: {
//         connect: {
//           id: 1,
//         },
//       },
//       seats: {
//         create: {
//           seatNum: "G06",
//           screen: {
//             connect: {
//               id: 2,
//             },
//           },
//         },
//       },
//     },
//   });
//   return ticketWithSeating;
// }

seed()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  })
  .finally(() => process.exit(1));
20030320