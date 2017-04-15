---
layout:     Post
title:      "Install NixOS on a So You Start Dedicated server"
subtitle:   "Using rescue mode we will replace an existing ArchLinux server by a NixOs instance."
date:       2015-09-26
author:     "Augustin Borsu"
---


<p>Long time ArchLinux user, I'm tempted by the reproductibility and stability proposed by NixOS while still being able to fully customize my installation. ArchLinux thanks to it's excellent wiki and spartan approach to installing your computer has thought me a lot about Linux, but I would now like to have a stable and easily transportable config in order to spend more time working and less time reinstalling arch every time I change computer or hard drive. After switching my desktop machine (It only took me 27 tries to almost completely replicate my Arch setup.) I'm now attempting the same with my dedicated server. Alas no guide or instruction exist so far on installing NixOS on an OVH style dedicated server. Here it comes.</p>

<p>
If you have  an existing OVH/SoYouStart/KimSufi server, these steps will allow you to overwrite the existing installation with nixos.<br />
The examples given here are from a real install on an existing SoYouStart ArchLinux Install.<br />
WARNING: YOU WILL LOSE YOUR DATA BY FOLLOWING THESE STEPS
</p>

<p>
Get the following information:<br />
<ul>
<li>hostname = ns358417</li>
<li>ipv4 :
<ul>
<li>address = 91.121.89.48</li>
<li>gateway = 91.121.89.254</li>
<li>dns = 213.186.33.99</li>
</ul></li>
<li>ipv6 :
<ul>
<li>address = 2001:41D0:1:8E30::</li>
<li>gateway = 2001:41D0:1:8Eff:ff:ff:ff:ff</li>
</ul></li>
</ul>

You can get the hostname by looking into /etc/hostname
<pre>
cat /etc/hostname
  ns358417
</pre>

The other information you need to get from your distro's network manager. Using ArchLinux do the following:
<pre>
cat /etc/netctl/ovh_net_eth0
  # IPv4 Setup
  Description='A basic static ethernet connection'
  Interface=eth0
  Connection=ethernet
  IP=static
  Address=('91.121.89.48/24')
  Gateway=('91.121.89.254')
  DNS=('213.186.33.99')
  TimeoutUp=300
  TimeoutCarrier=300

  # IPv6 Setup
  IP6=static
  Address6=('2001:41D0:1:8E30::/64')
  IPCustom=('-6 route add 2001:41D0:1:8Eff:ff:ff:ff:ff dev eth0' '-6 route add default via 2001:41D0:1:8Eff:ff:ff:ff:ff')
</pre>

Once you have those informations, reboot the server in rescue mode and after reciveing your credentials, log into it.

We will follow the instructions at <a href="https://nixos.org/wiki/How_to_install_NixOS_from_Linux">How to install NixOS from Linux</a> slightly modified to work on an OVH server.

First we need to install squashfs-tools, but since the rescue-mode doesn't allow the installation of additional packages, we will just get it in userland.

<pre>
apt-get download squashfs-tools
ar x squashfs-tools*.deb
tar xvf data.tar.xz
PATH=$PATH:/root/usr/bin
</pre>

Now follow the instructions from the <a href="https://nixos.org/wiki/How_to_install_NixOS_from_Linux">How to install NixOS from Linux</a>.
To gain time they are reproduced here but consult the original page for changes or more in depth explanations.

<pre>
cd ~
mkdir -p inst host/nix
wget http://nixos.org/releases/nixos/latest-iso-minimal-x86_64-linux
mount -o loop latest-iso-minimal-x86_64-linux inst
unsquashfs -d host/nix/store inst/nix-store.squashfs '*'

cd host
mkdir -p etc dev proc sys
cp /etc/resolv.conf etc/external-resolv.conf
for fn in dev proc sys; do mount --bind /$fn $fn; done
INIT=$(find . -type f -path '*nixos*/init')
BASH=$(find . -type f -path '*/bin/bash' | tail -n 1)
sed -i "s,exec systemd,exec /$BASH," $INIT

chroot . /$INIT
</pre>

Once you are in the chroot.
Mount your main partition. In case of doubt type lsblk and you should see a result like this.
<pre>
(chroot) lsblk
  NAME    MAJ:MIN RM   SIZE RO TYPE  MOUNTPOINT
  sda       8:0    0   1.8T  0 disk
  |-sda1    8:1    0  19.5G  0 part
  | `-md1   9:1    0  19.5G  0 raid1
  |-sda2    8:2    0 866.4G  0 part
  | `-md2   9:2    0 866.4G  0 raid1
  |-sda3    8:3    0   511M  0 part
  `-sda4    8:4    0 976.6G  0 part
    `-md4   9:4    0 976.6G  0 raid1
  sdb       8:16   0   1.8T  0 disk
  |-sdb1    8:17   0  19.5G  0 part
  | `-md1   9:1    0  19.5G  0 raid1
  |-sdb2    8:18   0 866.4G  0 part
  | `-md2   9:2    0 866.4G  0 raid1
  |-sdb3    8:19   0   511M  0 part
  `-sdb4    8:20   0 976.6G  0 part
    `-md4   9:4    0 976.6G  0 raid1
</pre>

In this case we have a raid with multiple partitions. If you used the default installer, the root partition should have a size of ≈20G. So in this case it is the /dev/md1 partition.

<pre>
(chroot) mount /dev/md1 /mnt
</pre>

Once that is done mount the other partitions. If you are unsure where to mount partitions have a look at the fstab in the mounted partition.
<pre>
(chroot) cat /mnt/etc/fstab
  # &lt;file system&gt;	&lt;mount point&gt;	&lt;type&gt;	&lt;options&gt;	&lt;dump&gt;	&lt;pass&gt;
  /dev/md1	/	ext4	errors=remount-ro	0	1
  /dev/md2	/home	ext4	defaults	1	2
  /dev/md4	/var	ext4	defaults	1	2
  /dev/sda3	swap	swap	defaults	0	0
  /dev/sdb3	swap	swap	defaults	0	0
  .
  .
  .
</pre>

<b>Note:</b> I actually formatted the disks so there was no longer any fstab and I recommend it to have a clean install. <br />
remember to add /mnt before each path. E.g.:
<pre>
(chroot) mount /dev/md2 /mnt/home
</pre>
Swap needs to be mounted using swapon. E.g. :
<pre>
(chroot) swapon /dev/sda3
</pre>

Once you are satisfied with your setup, generate a config and modify it to work on the ovh server.
<pre>
(chroot) nixos-generate-config --root /mnt
(chroot) nano /mnt/etc/nixos/configuration.nix
</pre>

In the config add the following, replacing the capitalized words by their value according to what you obtained in the first part.
<pre>

  # Use the GRUB 2 boot loader.
  boot.loader.grub.enable = true;
  boot.loader.grub.version = 2;

  # Define on which hard drive you want to install Grub.
  boot.loader.grub.device = "/dev/sda";

  # Define your hostname.
  networking.hostName = "HOSTNAME";

  # IPv4 settings
  networking.interfaces.eth0.ip4 = [ { address = "IPV4_GATEWAY"; prefixLength = 24; } ];
  networking.defaultGateway = "IPV4_GATEWAY";
  networking.nameservers = [ "IPV4_NAMESERVER" ];

  # IPv6 settings
  networking.localCommands =
    ''
      ip -6 addr add IPV6_ADDRESS/64 dev eth0
      ip -6 route add IPV6_GATEWAY dev eth0
      ip -6 route add default via IPV6_GATEWAY
    '';
</pre>

I also recommend enabling ssh and adding a user with a working password with sudo rights.
(Otherwise you will be locked out of your server.) And disable x11.
<pre>

  services.openssh.enable = true;
  services.xserver.enable = false;

  # Define a user account. Don't forget to set a password with ‘passwd’.
  users.extraUsers.firstuser = {
    isNormalUser = true;
    uid = 1000;
    extraGroups = [ "wheel" ];
    password = "defaultpassword";
  };

</pre>

finally install, unmount all partitions and log out.
<pre>
(chroot) nixos-install
(chroot) umount -R /mnt
(chroot) exit
</pre>

You must then go back to the server interface and change the netboot back to harddrive followed by a reboot of the machine.
Coming from arch, I find that NixOS can be a bit slow to boot so don't be surprised.
Personnally I had to wait a few minutes before the server finised rebooting.
</p>

<p><b>NOTES:</b>
A few things that I could have done if I had more time and if you do them I would love to hear from you.
<ul>
<li>Only tested this on two So You Start instances and would love to have feedback from people using OVH or KimSufi.</li>
<li>Couldn't test the ipv6 setup, I'm on holiday and don't have an ipv6 connection, will try next week though.</li>
<li>You could probably get the connection info from the rescue mode (at least the ipv4 one), would need to check the hostname and ipv6 settings. This would remove the need to install another distro.</li>
</p>

<p>Comments and feedback welcome on <a href="https://www.reddit.com/r/NixOS/comments/3mh5yr/install_nixos_on_a_soyoustart_dedicated_server/">reddit</a></p>
