---
layout:     Post
title:      "Set up a Kodi and SteamOS box"
subtitle:   "Overcoming the lacks of SteamOS and bringing out the best of two worlds"
date:       2015-12-12
author:     "Augustin Borsu"
---

<p>This is mostly written so that I remember how I installed it the next time I reformat my entertainment box to try something shiny and new. But as it might interest someone, I put it out there.</p>

<p>Thaks to ProfessorKaos64 and his <a href="https://github.com/ProfessorKaos64/SteamOS-Tools">SteamOS-Tools</a>, it is relatively painless to install kodi on SteamOS and access it through Steam's big picture interface. I could have left it at that, but two things profoundly disturbed me on SteamOS. First, try as I might, I could not find any easy way to boot into Kodi directly and still have a working steam controller. It might not seem like much but I use kodi almost every day and Steam maybe twice a month. Secondly, SteamOS was extremely unstable on my machine which defeats the entire purpose of having a fun time. (RAGE is not fun time.)</p>
<p>So being a long time ArchLinux user I did a minimal install of Arch with only Kodi, Steam and OpenBox installed (as well as samba, gdm and a few other things.) I set up GDM (I had a small issue with LightDM)to login automatically into my gaming user with an openbox session. Once in my <pre>~/.config/openbox/autostart</pre> contains the following lines.</p>
<pre>
kodi &
/usr/bin/steam -silent %U &
</pre>

<p>This boots into kodi with steam in the backgrounf (In order to have the steam controller working.) To switch to steam, I installed this wonderfull plugin <a href="http://forum.kodi.tv/showthread.php?tid=157499">SteamLauncher plugin</a>. And I can now continue to entertain the Idea that I will play Civilization 5 if I ever have the time.</p>

<p>Next step, set up lib retro.</p>
