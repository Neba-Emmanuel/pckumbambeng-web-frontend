export const quizQuestions = [
  {
    question: "Who built the ark?",
    options: ["Noah", "Moses", "David", "Peter"],
    answer: "Noah",
    reference: "Genesis 6:13–22",
    explanation: "Noah followed God’s instructions to build an ark.",
  },
  {
    question: "Where was Jesus born?",
    options: ["Nazareth", "Bethlehem", "Jerusalem", "Jericho"],
    answer: "Bethlehem",
    reference: "Luke 2:4–7",
    explanation: "Joseph and Mary travelled to Bethlehem, where Jesus was born.",
  },
  {
    question: "Who faced Goliath with a sling?",
    options: ["Saul", "Solomon", "David", "Samuel"],
    answer: "David",
    reference: "1 Samuel 17:40–50",
    explanation: "David faced Goliath with a sling and a stone, trusting God.",
  },
  {
    question: "What did Jesus use to feed the five thousand?",
    options: ["Seven loaves", "Manna", "Five loaves and two fish", "Bread and grapes"],
    answer: "Five loaves and two fish",
    reference: "John 6:9–13",
    explanation: "A boy’s five barley loaves and two fish became a meal for the crowd.",
  },
  {
    question: "Who helped the injured traveller in Jesus’ parable?",
    options: ["A priest", "A Samaritan", "A soldier", "A merchant"],
    answer: "A Samaritan",
    reference: "Luke 10:30–37",
    explanation: "The Samaritan showed mercy through practical care for his neighbour.",
  },
  {
    question: "What was Matthew’s occupation when Jesus called him?",
    options: ["Fisherman", "Carpenter", "Tax collector", "Shepherd"],
    answer: "Tax collector",
    reference: "Matthew 9:9",
    explanation: "Jesus called Matthew while he was sitting at the tax booth.",
  },
  {
    question: "Which is named as a fruit of the Spirit?",
    options: ["Fame", "Wealth", "Patience", "Popularity"],
    answer: "Patience",
    reference: "Galatians 5:22–23",
    explanation:
      "Patience is listed alongside love, joy, peace and other qualities of life in the Spirit.",
  },
  {
    question: "Who climbed a sycamore tree to see Jesus?",
    options: ["Nicodemus", "Zacchaeus", "Thomas", "Andrew"],
    answer: "Zacchaeus",
    reference: "Luke 19:1–10",
    explanation: "Zacchaeus climbed a tree, and Jesus called him by name.",
  },
  {
    question: "Who interpreted Pharaoh’s dreams in Egypt?",
    options: ["Joseph", "Joshua", "Jonah", "James"],
    answer: "Joseph",
    reference: "Genesis 41:14–36",
    explanation:
      "Joseph explained the dreams of seven years of plenty followed by seven years of famine.",
  },
  {
    question: "Who was placed in a den of lions?",
    options: ["Elijah", "Daniel", "Isaiah", "Paul"],
    answer: "Daniel",
    reference: "Daniel 6:16–23",
    explanation: "Daniel continued to pray, and God protected him in the lions’ den.",
  },
  {
    question: "Who said she would go with Naomi and share her people and God?",
    options: ["Esther", "Ruth", "Martha", "Deborah"],
    answer: "Ruth",
    reference: "Ruth 1:16–17",
    explanation: "Ruth chose to remain with Naomi, showing loyalty and love.",
  },
  {
    question: "Which disciple doubted until he saw the risen Jesus?",
    options: ["Thomas", "John", "Philip", "James"],
    answer: "Thomas",
    reference: "John 20:24–29",
    explanation: "Thomas encountered the risen Jesus and responded with faith.",
  },
];

export const peopleQuestions = [
  {
    question: "I led the Israelites out of Egypt. Who am I?",
    options: ["Moses", "Abraham", "Joshua", "Aaron"],
    answer: "Moses",
    reference: "Exodus 3:1–10",
    explanation: "God called Moses at the burning bush to lead his people out of Egypt.",
    hint: "God spoke to me from a burning bush.",
  },
  {
    question: "I became queen and spoke up for my people. Who am I?",
    options: ["Ruth", "Esther", "Mary", "Miriam"],
    answer: "Esther",
    reference: "Esther 4–7",
    explanation: "Esther courageously approached the king to plead for her people.",
    hint: "Mordecai was my guardian.",
  },
  {
    question: "I ran away from a mission to Nineveh. Who am I?",
    options: ["Jonah", "Elijah", "Peter", "Paul"],
    answer: "Jonah",
    reference: "Jonah 1–3",
    explanation: "After being swallowed by a great fish, Jonah eventually went to Nineveh.",
    hint: "I spent three days and nights inside a great fish.",
  },
  {
    question:
      "I was a fisherman who became one of Jesus’ disciples. I denied knowing him three times. Who am I?",
    options: ["Peter", "Matthew", "Luke", "Stephen"],
    answer: "Peter",
    reference: "Luke 22:54–62",
    explanation: "Peter denied Jesus, but his story also includes restoration and renewed service.",
    hint: "My other name was Simon.",
  },
  {
    question: "I heard God calling my name while I was young. Who am I?",
    options: ["Samuel", "Solomon", "Timothy", "Isaac"],
    answer: "Samuel",
    reference: "1 Samuel 3:1–10",
    explanation: "Eli helped Samuel recognise that the Lord was calling him.",
    hint: "I served under Eli.",
  },
  {
    question: "I travelled to Damascus when a light from heaven stopped me. Who am I?",
    options: ["Paul", "Barnabas", "Silas", "Philip"],
    answer: "Paul",
    reference: "Acts 9:1–19",
    explanation: "Saul, also known as Paul, encountered Jesus on the road to Damascus.",
    hint: "I am also known as Saul.",
  },
];

export const sequences = [
  {
    title: "The first five books",
    prompt: "Arrange these books in Bible order.",
    items: ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy"],
    reference: "The Pentateuch",
  },
  {
    title: "The life of Jesus",
    prompt: "Put these events in chronological order.",
    items: [
      "Birth in Bethlehem",
      "Baptism by John",
      "Feeding the five thousand",
      "The Last Supper",
      "Resurrection",
    ],
    reference: "Luke 2; Matthew 3; John 6; Luke 22; Luke 24",
  },
  {
    title: "The story of Moses",
    prompt: "Put these moments in Moses’ story in order.",
    items: [
      "Baby in a basket",
      "The burning bush",
      "The Passover in Egypt",
      "Crossing the sea",
      "Receiving the commandments",
    ],
    reference: "Exodus 2; 3; 12; 14; 20",
  },
];

export const memoryPairs = [
  ["Noah", "Ark", "Genesis 6"],
  ["David", "Sling", "1 Samuel 17"],
  ["Jonah", "Great fish", "Jonah 1–2"],
  ["Daniel", "Lions", "Daniel 6"],
  ["Moses", "Burning bush", "Exodus 3"],
  ["Zacchaeus", "Sycamore tree", "Luke 19"],
];

export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
