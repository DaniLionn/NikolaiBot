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
  ["Are you gay?", ["yes"]],
  [`What's your opinion on “Motojiro Kajii”`, ["anything"]],
  [
    "What is the first row of the keyboard? (Skipping numbers only letters)",
    ["qwertyuiop"],
  ],
  ["What song is this: hottarakashi de kusatte imasu", ["apple dot com"]],
  ["Am I sane?", ["yes", "yes babe", "absolutely"]],
  ["There was a murder! Who's the Victim?", ["me"]],
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
];

const gifs = [
  "https://tenor.com/view/nikolai-nikolai-gogol-sigma-bungo-stray-dogs-bsd-gif-6692790380853296197",
  "https://tenor.com/view/nikolai-gogol-nikolai-bungo-stray-dogs-kya-oops-gif-27501016",
  "https://tenor.com/view/nikolai-nikolai-gogol-bsd-bungo-stray-dogs-laugh-gif-6503890176531925877",
  "https://tenor.com/view/nikolai-gogol-anime-bsd-bungo-stray-dogs-bungou-stray-dogs-gif-8656635119997500484",
  "https://tenor.com/view/nikolai-gogol-bsd-bungou-stray-dogs-gif-27653499",
  "https://tenor.com/view/nikolai-nikolai-gogol-bungou-stray-dogs-bungo-stray-dogs-bsd-gif-5147037420049710374",
];

// Function to find a channel by name in a guild
async function findChannelByName(guild, channelName) {
  // Fetch all channels in the guild
  const channels = guild.channels.cache;

  // Search for the channel by name
  const channel = channels.find((channel) => channel.name === channelName);

  return channel; // Returns the channel if found, otherwise returns undefined
}

async function waitForMessage(channel) {
  //console.log(channel.name);
  return new Promise((resolve, reject) => {
    const messageFilter = (message) => !message.author.bot; // Filter out bot messages

    const messageCollector = channel.createMessageCollector({
      filter: messageFilter,
      time: 60000,
    }); // Timeout after 60 seconds

    messageCollector.on("collect", (message) => {
      //console.log(message);
      // Resolve the promise with the collected message
      resolve(message);
      // Stop collecting messages
      messageCollector.stop();
    });

    messageCollector.on("end", (collected, reason) => {
      if (reason === "time") {
        // Reject the promise if no message was collected within the timeout
        reject(new Error("No message collected within the timeout"));
      }
    });
  });
}

async function findRoleIdByName(guild, roleName) {
  // Find the role by name
  const role = guild.roles.cache.find((role) => role.name === roleName);

  if (role) {
    //console.log(role);
    // If the role is found, return its ID
    return role.id;
  } else {
    // If the role is not found, return null or throw an error
    return undefined; // or throw new Error('Role not found');
  }
}

exports.askQuestion = async function (guild, channel, isCommand) {
  //console.log(guild);

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

    await channel.send(gifs[Math.floor(Math.random() * gifs.length)]);

    if (isCommand === false) {
      await channel.send(
        `# <@&${role}>\n# Quiz time!\n${chosenQuestion[0]}\nYou have one minute to answer!`
      );
    } else {
      await channel.send(
        `# Quiz time!\n${chosenQuestion[0]}\nYou have one minute to answer!`
      );
    }

    try {
      const collectedMessage = await waitForMessage(channel);

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
          let correctAnswer =
            chosenQuestion[1][
              Math.floor(Math.random() * chosenQuestion[1].length)
            ];

          //console.log(correctAnswer);

          await channel.send(
            `You're wrongzo buddy!\nThe correct answer was "${correctAnswer}"!\nAnyways, it's time for me to bounce! Cya!`
          );
        }
      }
    } catch (error) {
      console.error(error.message);
      if (error.message === "No message collected within the timeout") {
        await channel.send(
          "Aw man, guess nobody wants to answer... Welp, time to bounce!"
        );
      }
    }
  }
};
