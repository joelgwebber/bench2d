#!/bin/sh
java -cp ./lib/gwt-dev.jar:./lib/gwt-user.jar:./src:./gwt:./lib/jbox2d-library-2.2.1.2-SNAPSHOT-jar-with-dependencies.jar:./lib/jbox2d-library-2.2.1.2-SNAPSHOT-sources.jar  com.google.gwt.dev.Compiler -XdisableCastChecking  -optimize 10 -XenableClosureCompiler -style PRETTY j15r.Bench2d

