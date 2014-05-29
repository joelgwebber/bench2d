#!/bin/sh
java -cp ./lib/gwt-dev.jar:./lib/gwt-user.jar:./src:./gwt:./lib/jbox2d-library-2.2.1.2-SNAPSHOT-jar-with-dependencies.jar:./lib/jbox2d-library-2.2.1.2-SNAPSHOT-sources.jar  com.google.gwt.dev.Compiler -XdisableClassMetadata -XdisableCastChecking  -optimize 10 -XenableClosureCompiler -style OBF j15r.Bench2dMin

