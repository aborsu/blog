---
layout:     Post
title:      "Combining apache spark and ipython notebook"
subtitle:   "With Ipython3 stable out, using spark in Ipython notebook has just become a lot easier."
date:       2015-03-05 14:18:00
author:     "Augustin Borsu"
---

<p><a href="http://ipython.org/">Ipython 3</a> renamed jupyter by its creators introduces the possibility to use different kernels and thus programming languages than the python 2 and 3 kernels. So the first thing you should do is <a href="http://ipython.org/install.html">install it</a> as well as its notebook. The easiest way is to use the python pip installer.</p>
<p>for Arch linux :</p>
<blockquote>
sudo pacman -S python-pip<br />
(sudo) pip install "ipython[notebook]"
</blockquote>
<p>Second hing to do is to get a kernell that will allow us to use Scala with jupyter/Ipython. The wiki lists quite a <a href="https://github.com/ipython/ipython/wiki/IPython-kernels-for-other-languages">few</a> and while there is a <a href="https://github.com/ibm-et/spark-kernel">Spark Kernel</a> I believe the scala kernell <a href="https://github.com/mattpap/IScala">Iscala</a> is much easier to use with dependencies. (There is also a link to the <a href="https://github.com/jove-sh">Jove project</a> which seems interesting but I haven't had time to check it out.) So get over there and download the <a href="https://github.com/mattpap/IScala/releases">Iscala.jar</a> or build it from source.</p>

<p>Now that you have you jar, we need to create a custom kernell for Ipython. This is made extremely simple, find your ipython config directory which should be ~/.ipython or ~/.config/ipython (for ubuntu users) and create a kernel dir. Inside create a iscala dir and copy the following text in a kernel.json file.

<blockquote>
{<br />
 "argv": ["java", "-jar", "/path/to/IScala.jar", "--connection-file", "{connection_file}"],<br />
 "display_name": "IScala",<br />
 "language": "scala"<br />
}
</blockquote>

<p>For the ones who like it, you can also add a logo-64x64.png file next to it that will be displayed in the top right corner of the notebook when using the kernell. (I downloaded the scala logo from the <a href="http://www.scala-lang.org/">scala homepage</a>.) and to make it all easier here is a copy of my <a href="https://github.com/aborsu985/ipython-kernels">kernels</a></p>

<p>Once you have this setup, using spark in ipython notebook is as easy as launching it :</p>
<blockquote>
iython notebook
</blockquote>
<p>Creating a new notebook with the iscala kernel and adding these two lines IN SEPERATE CELLS to your notebook</p>
<blockquote>
%libraryDependencies += "org.apache.spark" %% "spark-core" % "1.2.0"<br />
<br />
%update<br />
</blockquote>
<p>This is actually the way to add all your dependencies to your project. Once this is done, you can import and create a spark context just like you would in a standalone scala application and use it just as you would the spark-shell.</p>
<p>Here is my <a href="http://nbviewer.ipython.org/github/aborsu985/jupyter-notebooks/blob/master/Graphx%20Sandbox.ipynb">first spark notebook</a> as an example which you can also fork from my <a href="https://github.com/aborsu985/jupyter-notebooks">repo</a> </p>
<p>Voilà !!! you can now easily sandbox your spark development.</p>
