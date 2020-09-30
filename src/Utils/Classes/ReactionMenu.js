class ReactionMenu {
  constructor (
    channel,
    userId,
    time,
    main = {},
    pages = {},
    {
      end = message => {
        message
          .delete({
            timeout : 0,
            reson   : 'Free up clutter',
          })
          .catch(() => {
            return;
          });
      },
      back = Utils.emojis.back,
    },
  ) {
    this.channel = channel;
    this.userId = userId;
    this.time = time;
    this.end = end;
    this.back = back;
    this.emojis = Object.keys(pages);
    this.pages = pages;
    this.main = main;
    this.onMain = true;
    this.react = this.emojis;
    this.current = main;
    this.currentEmoji = undefined;
    this.setup();
  }

  setup () {
    this.channel.send(this.current).then(message => {
      this.message = message;
      this.react.forEach(emoji => message.react(emoji));
      this.reaction();
    });
  }

  async deleteReaction () {
    const message = this.message;
    if (message.guild) {
      // To Fix wierd bug
      message.reactions
        .removeAll()
        .then(() => {
          this.react.forEach(emoji => message.react(emoji));
          this.reaction();
        })
        .catch(e => {
          throw new Error(e);
        });
    }
    else {
      message
        .delete({
          timeout : 0,
          reson   : '',
        })
        .catch(() => {
          return;
        });
      this.channel.send(this.current).then(message => {
        this.message = message;
        this.react.forEach(emoji => this.message.react(emoji));
        this.reaction();
      });
    }
  }

  changePage (emoji) {
    if (emoji === this.back) {
      this.onMain = true;
      this.current = this.main;
      this.react = this.emojis;
    }
    else {
      this.onMain = false;
      this.current = this.pages[emoji].data;
      this.currentEmoji = emoji;
      this.react = [
        this.back,
        ...Object.keys(this.pages[emoji].emojis),
      ];
    }

    if (this.message.guild) {
      this.message.edit(this.current);
      this.deleteReaction();
    }
    else {
      this.deleteReaction();
    }
  }

  reaction () {
    const message = this.message;
    const pages = this.pages;
    const filter = (reaction, user) => {
      return (
        this.react.includes(reaction.emoji.name || reaction.emoji.id) &&
        (
          typeof this.userID === 'array' ? this.userID.includes(user.id) :
          user.id === this.userId)
      );
    };
    message
      .awaitReactions(filter, {
        max    : 1,
        time   : this.time,
        errors : [
          'time',
        ],
      })
      .then(collected => {
        const reaction = collected.first();
        if (!reaction) return this.end(message, collected);
        const name = reaction.emoji.name || reaction.emoji.id;
        if (this.onMain && this.react.includes(name) && this.pages[name]) {
          this.changePage(name);
        }
        else if (name === this.back) {
          this.changePage(this.back);
        }
        else if (this.react.includes(name)) {
          if (this.message.guild) {
            const userReactions = this.message.reactions.cache.filter(reactionUser =>
              reactionUser.users.cache.has(message.client.user.id),
            );
            try {
              for (const reactionEmoji of userReactions.values()) {
                reactionEmoji.users.cache
                  .filter(user => user.id !== message.client.user.id)
                  .forEach(user => reactionEmoji.users.remove(user));
              }
            } catch (e) {
              throw new Error(e);
            }
            this.reaction();
          }
          else {
            this.message
              .delete({
                timeout : 0,
                reson   : '',
              })
              .catch(() => {
                return;
              });
            this.channel.send(this.current).then(message => {
              this.message = message;
              this.react.forEach(emoji => message.react(emoji));
              this.reaction();
            });
          }
          try {
            pages[this.currentEmoji].emojis[name](message);
          } catch (error) {
            throw new Error(error);
          }
        }
      })
      .catch(collected => {
        this.end(message, collected);
      });
  }
}

module.exports = ReactionMenu;
