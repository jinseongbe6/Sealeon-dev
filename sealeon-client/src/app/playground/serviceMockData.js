const servicesData = [
  {
    imageUrl: "/images/thumbnail_sample_01.png",
    name: "Service 1",
    description: "This is a description for Service 1.",
    price: 0.6,
    tags: ["Tag1", "Tag2", "Tag3"],
    deadline: "2024-04-30",
    isActive: true,
    serviceId: "asdlfjkjiwef",
    remainingTime: "3hr",
  },
  {
    imageUrl: "/images/thumbnail_sample_02.png",
    name: "Service 2",
    description:
      "This is a description for Service 2.This is a description for Service 2This is a desc",
    price: 0.18,
    tags: ["Tag1", "Tag4"],
    deadline: "2024-05-15",
    isActive: false,
    serviceId: "asdlweuyfas2345",
    remainingTime: "1hr",
  },
].concat(
  Array.from({ length: 18 }).map((_, index) => ({
    imageUrl: `/images/thumbnail_sample_0${
      Math.floor(Math.random() * 2) + 1
    }.png`,
    name: `Service ${index + 3}`,
    description: `This is a description for Service ${index + 3}.`,
    price: (index + 1) / 10,
    tags: [`Tag${(index % 5) + 1}`, `Tag${((index + 1) % 5) + 1}`],
    deadline: `2024-${String((index % 12) + 1).padStart(2, "0")}-15`,
    isActive: index % 2 === 0,
    serviceId: `asdlfjkjiwef${index}`,
  }))
);

export default servicesData;
