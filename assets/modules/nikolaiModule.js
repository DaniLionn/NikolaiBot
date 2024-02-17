var quizActive = [];

const questionsAndAnswers = [
  [
    "Who was the first member of the ADA (Armed detective agency)?",
    ["ranpo", "rampo", "fukuzawa"],
  ],
  ["Who is a casino simp?", ["sigma", "micah"]],
  [
    "How many manga chapters of Bungo Stray Dogs has been animated (UP TO SEASON 5)",
    ["109"],
  ],
  [
    "What is the first letter in the song “All those feelings have to go” by Friendxp?",
    ["i"],
  ],
  [
    "What group is Nikolai (omg me the bot) part of?",
    ["the decay of angels", "decay of angels"],
  ],
  ["Who likes being called “Tit the Us”", ["titus"]],
  ["Are you gay?", ["yes", "yes babe", "absolutely"]],
  [`What's your opinion on “Motojiro Kajii”`, ["anything"]],
  [
    "What is the first row of the keyboard? (Skipping numbers only letters)",
    ["qwertyuiop"],
  ],
  ["What do you drink for hyrdation?", ["anything"]],

  ["What song is this: hottarakashi de kusatte imasu", ["apple dot com"]],
  ["Am I sane?", ["yes", "yes babe", "absolutely"]],
  ["There was a murder! Who's the victim?", ["me"]],
  ["What is the best sauce?", ["alfredo"]],
  [
    "What is my ability?",
    [
      "the overcoat",
      "teleport shit with your cape idk",
      "teleport crap with your cape idk",
      "30 meter",
      "30 metre",
    ],
  ],
  ["What is the best vocaloid?", ["vflower"]],
  ["What is the best flavour of chip?", ["cheese", "cheddar", "orange"]],
  ["Trans rights are..?", ["human rights"]],
  ["Solve this math question!", ["%a"]],
  ["What is my name?", ["nikolai", "gogol", "nikolai gogol"]],
];

const gifs = [
  "https://tenor.com/view/nikolai-nikolai-gogol-sigma-bungo-stray-dogs-bsd-gif-6692790380853296197",
  "https://tenor.com/view/nikolai-gogol-nikolai-bungo-stray-dogs-kya-oops-gif-27501016",
  "https://tenor.com/view/nikolai-nikolai-gogol-bsd-bungo-stray-dogs-laugh-gif-6503890176531925877",
  "https://tenor.com/view/nikolai-gogol-anime-bsd-bungo-stray-dogs-bungou-stray-dogs-gif-8656635119997500484",
  "https://tenor.com/view/nikolai-gogol-bsd-bungou-stray-dogs-gif-27653499",
  "https://tenor.com/view/nikolai-nikolai-gogol-bungou-stray-dogs-bungo-stray-dogs-bsd-gif-5147037420049710374",
  "https://tenor.com/view/bsd-nikolai-gogol-nikolai-tilda-bsd-anime-gif-27567081",
  "https://tenor.com/view/nikolai-gogol-bungou-stray-dogs-gif-1254836737966925119",
  "https://tenor.com/view/nikolai-gogol-anime-bsd-bungo-stray-dogs-bungou-stray-dogs-gif-12291645727271205830",
  "https://tenor.com/view/sigma-sigma-bsd-nikolai-nikolai-bsd-nikolai-gogol-gif-15117654677192711584",
];

var operators = [
  {
    sign: "+",
    method: function (a, b) {
      return a + b;
    },
  },
  {
    sign: "-",
    method: function (a, b) {
      return a - b;
    },
  },
  {
    sign: "×",
    method: function (a, b) {
      return a * b;
    },
  },
  {
    sign: "÷",
    method: function (a, b) {
      return a / b;
    },
  },
];

async function findChannelByName(guild, channelName) {
  const channels = guild.channels.cache;

  const channel = channels.find((channel) => channel.name === channelName);

  return channel;
}

async function waitForMessage(channel, seconds) {
  //console.log(channel.name);
  return new Promise((resolve, reject) => {
    const messageFilter = (message) => !message.author.bot;

    const messageCollector = channel.createMessageCollector({
      filter: messageFilter,
      time: seconds * 1000,
    });

    messageCollector.on("collect", (message) => {
      //console.log(message);

      resolve(message);

      messageCollector.stop();
    });

    messageCollector.on("end", (collected, reason) => {
      if (reason === "time") {
        reject(new Error("No message collected within the timeout"));
      }
    });
  });
}

async function findRoleIdByName(guild, roleName) {
  const role = guild.roles.cache.find((role) => role.name === roleName);

  if (role) {
    //console.log(role);

    return role.id;
  } else {
    return undefined;
  }
}

exports.askQuestion = async function (guild, channel, isCommand) {
  //console.log(guild);

  let answerTime = 60;

  if (!quizActive[guild.id]) {
    quizActive[guild.id] = false;
  }

  if (quizActive[guild.id] === false) {
    quizActive[guild.id] = true;

    if (!channel) {
      channel = await findChannelByName(guild, "nikolais_quiz_time");
    }

    let role = await findRoleIdByName(guild, "🎲 Nikolai's Quiz Time");

    if (channel != undefined && role != undefined) {
      //console.log(channel.name);
      let chosenQuestion =
        questionsAndAnswers[
          Math.floor(Math.random() * questionsAndAnswers.length)
        ];

      // console.log(chosenQuestion[0], chosenQuestion[1]);

      if (chosenQuestion[0] != "There was a murder! Who's the victim?") {
        await channel.send(gifs[Math.floor(Math.random() * gifs.length)]);
      } else {
        await channel.send(gifs[3]);
      }

      if (chosenQuestion[0] === "Solve this math question!") {
        answerTime = 120;

        var operand = operators[Math.floor(Math.random() * operators.length)];

        let num1 = Math.floor(Math.random() * 30) + 1;
        let num2 = Math.floor(Math.random() * 30) + 1;

        chosenQuestion[0] = `Solve this math question!\n## ${num1} ${operand.sign} ${num2}`;

        let result = operand.method(num1, num2);
        console.log(result);
        chosenQuestion[1] = `${result}`;
      }
      if (isCommand === false) {
        let minutes = answerTime / 60;

        if (minutes == 1) {
          await channel.send(
            `# <@&${role}>\n# Quiz time!\n${chosenQuestion[0]}\nYou have ${minutes} minute to answer!`
          );
        } else {
          await channel.send(
            `# <@&${role}>\n# Quiz time!\n${chosenQuestion[0]}\nYou have ${minutes} minutes to answer!`
          );
        }
      } else {
        let minutes = answerTime / 60;

        if (minutes == 1) {
          await channel.send(
            `# Quiz time!\n${chosenQuestion[0]}\nYou have ${minutes} minute to answer!`
          );
        } else {
          await channel.send(
            `# Quiz time!\n${chosenQuestion[0]}\nYou have ${minutes} minutes to answer!`
          );
        }
      }

      var correctAnswer =
        chosenQuestion[1][Math.floor(Math.random() * chosenQuestion[1].length)];

      try {
        const collectedMessage = await waitForMessage(channel, answerTime);

        //   console.log(
        //     `Message "${collectedMessage.content}" received from user "${collectedMessage.author.tag}"`
        //   );

        if (chosenQuestion[1][0] === "anything") {
          await channel.send(
            "Great answer! Anyways, it's time for me to bounce! Cya!"
          );
        } else {
          if (
            chosenQuestion[1].includes(collectedMessage.content.toLowerCase())
          ) {
            await channel.send(
              "You're correct! And it's time for me to bounce! Cya!"
            );
          } else {
            //console.log(correctAnswer);

            await channel.send(
              `You're wrongzo buddy!\nThe correct answer was "${correctAnswer}"!\nAnyways, it's time for me to bounce! Cya!`
            );
          }
        }
      } catch (error) {
        if (error.message === "No message collected within the timeout") {
          await channel.send(
            `Ohhhh, too slow! The correct answer was "${correctAnswer}".`
          );
          return;
        }
        console.error(error.message);
      }
    }
  }

  quizActive[guild.id] = false;
};
