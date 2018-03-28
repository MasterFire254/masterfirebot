const discord = require('discord.js');
const opusscript = require('opusscript');
const ffmpeg = require('ffmpeg-binaries');
const youtubeStream = require('ytdl-core');
const fluentffmpeg = require('fluent-ffmpeg');
const bot = new discord.Client(); 

var prefix = (".")
var secondaryPrefix = ("?")

var role = "Rebel";


bot.on('ready', function(){
    
    console.log(`Connecté avec ${bot.user.tag} (${bot.user.id}) sur ${bot.guilds.size} serveurs`);
    bot.user.setGame('.help');
});

bot.on('message', message =>{;

    var args = message.content.substring(prefix.length).split(' ');

    if(message.content === secondaryPrefix + "bg"){
        message.channel.sendMessage("C'est Benedict ");
    };

    if(message.content === prefix + "help"){

        //HELP
        var embed = new discord.RichEmbed()
            .setTitle("Page d'aide")
            .addBlankField()
            .addField("Commandes pour les admins", "Commandes réservées au best")
            .addField(".ban [@pseudo] ","Permet de ban des joueurs")
            .addField(".kick [@pseudo]", "Permet de kick des joueurs")
            .addField(".changerole [role]", "Permet de changer le role qui est donné aux nouveaux arrivants")
            .addBlankField()
            .addField("Commandes pour tous le mondes", "Commandes utiles mais pas marrantes")
            .addField(".discordinfo","Permet d'avoir des infos sur le Discord")
            .addField(".play [link]","Permet de jouer une vidéo graçe à un lien youtube")
            .setColor(255, 0, 0)
            message.channel.sendEmbed(embed);

    };

    //PING
    if(message.content === prefix + "ping"){
        const then = Date.now();
        message.channel.send('Pinging...').then(m =>{
            m.edit(`Pong! Ca a pris  ${Date.now() - then}ms pour envoyer ce message\nPing du bot : ${bot.ping}ms`);
        });
    }
    //KICK
    if(message.content.startsWith(prefix + "kick")){
        if(!message.member.permissions.has('KICK_MEMBERS')) return message.reply("Tu n'as pas les permissions nécéssaires.");
        const member = message.mentions.members.first();
        if(!member) return message.reply("Mauvais usage fait comme ça : `.kick @User#1234`");
        if(member && message.member.permissions.has("KICK_MEMBERS")){
        member.kick(`Kicker par ${message.author.tag}`);
        message.reply("Le joueur a bien été kiker.");
        }

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
        message.channel.sendEmbed(embed);
    }

    //CHANGE ROLE
    if(message.content.startsWith(prefix + "changerole")){
        if(message.member.permissions.has('ADMINISTRATOR')){
            if(!args[1]) return message.reply("Met un role");
                role = args[1]
                message.reply("Le role a bien été changer");
        }
    }


    //CHANGE COLOR
    if(message.content.startsWith(prefix + "changenamecolor")){
        if(!args [1]){
            var embed = new discord.RichEmbed()
                .setTitle("Couleur possible")
                .addField()
        }
    }
  
    //MUSIC
    if(message.content.startsWith(prefix + "play")){
        if(!message.member.voiceChannel){
            let voiceChannel = message.guild.channels.filter(function(chnnel){return chnnel.type === 'voice'}).first();
            voiceChannel.join().then(function(connection){

                        stream.on('error', function(){
                        message.reply("Impossible de lire la vidéo");
                        connection.disconnect();
                    })
                    let stream = youtubeStream(args[1]);
                    connection.playStream(stream).on('end', function(){
                        connection.disconnect();
                    })
        
            })
        }
    }
});

//AUTO ROLE ET BIENVENUE
bot.on("guildMemberAdd", member =>{
    member.guild.channels.find("name", "general").send(`Bienvenue ${member}`);
    if(!member.guild.roles.find('name', role)) return console.log("Role inconnu");
    member.addRole(member.guild.roles.find('name', role));
})

bot.login(process.env.TOKEN);
