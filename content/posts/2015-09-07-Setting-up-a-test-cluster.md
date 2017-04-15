---
layout:     Post
title:      "Setting up a test cluster using VirtualBox, Packer and Vagrant"
subtitle:   "In order to test cluster deployment using ansible, we use a dummy cluster created using VirtualBox, Packer and Vagrant."
date:       2015-09-07
author:     "Augustin Borsu"
---

The code for this post is in the following repositories:
<ul>
<li><a href="https://github.com/aborsu/packer-centos7">aborsu/packer-centos7</a></li>
<li><a href="https://github.com/aborsu/test-cluster">aborsu/test-cluster</a></li>
<li><a href="https://github.com/aborsu/ansible-roles">aborsu/ansible-roles</a></li>
</ul>
<p>As we turn to clould frameworl like Hadoop, Spark, Mesos or Storm, it becomes necessary to test not only the code but also its deployment. In order to do this in a reproductible manner, we have started using ansible roles, and to test these we use dummy clusters.</p>

<p>To create these we first need a basic centos image (We use centos in our deployment cluster.) Quickly problems arose from using different providers and providers versions with Vagrant. In order to solve them, we started creating our own boxes using packer. This allows everyone to create a box containing the VirtualBox guest modules corresponding to his/her VirtualBox version. The code is in the first repository <a href="https://github.com/aborsu/packer-centos7">aborsu/packer-centos7</a>.</p>

<p>Once this image is launched, a common Vagrantfile is used to launch a cluster. The vagrant file allows to easily modify the quantity and settings of the cluster nodes. Also by changing the vm.network setting from private to public, we can create a shared test cluster in our local network. <a href="https://github.com/aborsu/test-cluster">aborsu/test-cluster</a>.</p>

<p> Finally the <a href="https://github.com/aborsu/ansible-roles">aborsu/ansible-roles</a> repository contains our roles and a test inventory file. The same repo is actually used with a different inventory file to deploy on the cluster.</p>s
