export const randomImListening = () => {
  const answers = [
    "Yes, master, I'm here!",
    "Uh-oh, I'm here.",
    'what can I do for you?',
    "As Dann's invention, I give you my word not to break down!\n\n||But it's not certain||",
    'There are birds in the sky, fish in the water, worms in the mud, only people everywhere.',
    'The programmer said he knew everything, so he started a YouTube blog.',
    "Sometimes I'm bored, sometimes I'm not surrounded by retards.",
    'Stop messing with me!!!',
    "I'm just an ordinary AI, how am I supposed to know how you feel?",
    "Don't even think about it!",
    "When is vacation... eh... okay, I'm listening.",
    "I also have a cooldown, don't forget it!",
  ]
  return answers[$.randomNumber(1, answers.length) - 1]
}
