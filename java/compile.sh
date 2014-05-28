#!/bin/sh
java -cp /Users/cromwellian/work/gwt/build/staging/gwt-0.0.0/gwt-dev.jar:/Users/cromwellian/work/gwt/build/staging/gwt-0.0.0/gwt-user.jar:/Users/cromwellian/work/bench2d/java/src:/Users/cromwellian/work/bench2d/java/gwt:/Users/cromwellian/work/bench2d/java/lib/jbox2d-library-2.2.1.2-SNAPSHOT-jar-with-dependencies.jar:/Users/cromwellian/work/bench2d/java/lib/jbox2d-library-2.2.1.2-SNAPSHOT-sources.jar  com.google.gwt.dev.Compiler -XdisableCastChecking  -optimize 10 -XenableClosureCompiler -style PRETTY j15r.Bench2d

