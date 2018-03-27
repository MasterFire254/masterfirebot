const discord = require('discord.js');
const YTDL = require('ytdl-core');
var opusscript = require("opusscript");
var ffmpeg = require('ffmpeg');
const bot = new discord.Client();

var prefix = (".")
var secondaryPrefix = ("?")

function play(connection, message){
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

    server.queue.shift();

    server.dispatcher.on("end", function(){
        if(server.queue[0]){
            play(connection, message);
        }else{
            connection.disconect();
        }
    });
}

var servers = {};

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
            .addField(".ban [@pseudo] ","Permet de ban des joueurs")
            .addField(".kick [@pseudo]", "Permet de kick des joueurs")
            .addField(".changecolor [@role]","Permet de changer la couleur d'un role")
            .addField(".helpmusic","Permet de voir les commandes pour les musics")
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

    //MUSIC
    if(message.content === prefix + "helpmusic"){
        var embed = new discord.RichEmbed()
            .setTitle("Help Music")
            .addField(".play [link]", "Permet de jouer une music a partir d'un lien youtube.")
            .addField(".stop", "Permet de stopper la music.")
            .addField(".skip","Permet de passer à la music suivante.")
            .setColor(0, 255, 0)
            message.channel.sendEmbed(embed);
    }

    if(message.content.startsWith(prefix + "play")){
        if(!args[1]){
            message.reply("Met un lien putain");
            return;
        }

        if(!message.member.voiceChannel){
            message.reply("Tu peut aller dans un channel vocal ? PLUS VITE !");
            return;
        }

        var server = servers[message.guild.id] = {
            queue: []
        };

        server.queue.push(args[1]);

        if(!message.guild.voiceConnection){
            message.member.voiceChannel.join().then(function(connection){
                play(connection, message);
            });
        }

    }

    if(message.content === 'skip'){
        var server = servers[message.guil.id];
        if(server.dispatcher) server.dispatcher.end();
    }

    if(message.content === "stop"){
        var server = servers[message.guil.id];
        if(message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
    }

});

bot.login(process.env.TOKEN);
