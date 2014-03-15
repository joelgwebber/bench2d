## What is this?

A simple VM performance benchmark suite that attempts to guage the performance of various VMs on a real-world
workload using the Box2D (http://box2d.org/) physics library. This library is particularly suited to benchmarking
VM performance because it's compute-intensive, often a real-world performance bottleneck in games, and has been
ported to many languages. You can find more background [here](http://j15r.com/blog/2011/12/15/Box2D_as_a_Measure_of_Runtime_Performance),
[here](http://j15r.com/blog/2013/04/25/Box2d_Revisited), and [here](http://j15r.com/blog/2013/04/25/Box2d_Addendum).

### Current results (as of 15 March 2014):

<center>

|                           | ms/frame | 5th %ile | 95th %ile | Ratio to C |
|---------------------------|----------|----------|-----------|------------|
|C (clang-500.2.79)         | 2.14     | 1.89     | 2.41      | 1.00       |
|pNaCl                      | 2.61     | 2.31     | 2.92      | 1.22       |
|asm.js (Firefox 27)        | 3.24     | 3.00     | 4.00      | 1.51       |
|Flash/Crossbridge (\*)     | 5.16     | 4.16     | 7.81      | 2.41       |
|asm.js (Chrome 33)         | 5.43     | 4.00     | 6.00      | 2.54       |
|Java (1.8)                 | 5.71     | 5.00     | 6.00      | 2.67       |
|AS3                        | 8.15     | 7.00     | 9.00      | 3.81       |
|asm.js (IE11)              | 9.54     | 7.00     | 12.0      | 4.46       |
|Dart (Dartium)             | 10.8     | 9.00     | 14.0      | 5.05       |
|Box2dWeb (Firefox 27)      | 10.9     | 10.0     | 11.0      | 5.10       |
|Box2dWeb (Chrome 33)       | 14.5     | 12.0     | 18.0      | 6.78       |
|Box2dWeb (Safari 7)        | 15.5     | 13.0     | 19.0      | 7.24       |
|Box2dWeb (IE11)            | 15.6     | 13.0     | 21.0      | 7.29       |
|Dart2js (Chrome 33)        | 30.6     | 26.0     | 35.0      | 14.3       |
|asm.js (Safari 7) (\*\*)   | 272.     | 240.     | 309.      | 127.       |

</center>

[Test platform: MacBook Pro, 2.3 GHz i7, 16G memory, Mac OS X 10.9.2, Windows 7.
 All platform and compiler versions are latest unless otherwise specified.]

(*) Crossbridge is exhibiting some kind of problem calculating 5th %ile, so I
just set it to the mean - 1.

(**) asm.js performs so badly on Safari 7 that I left it off the graph to
avoid making it impossible to read.

<center>
  ![](graph.png)

  Scaled to multiples of native performance. The white line denotes the mean,
  and the edges of   the box denote the 5th and 95th %iles.
</center>


### Old Results:

[5 July 2013](2014.07.05/results.md)


### Mini FAQ:

- But physics library (X) outperforms Box2D on platform (Y)!
  - That's not the point. The point is to test *VM* performance by using a similar code base on different platforms.
- But Box2dweb is a crappy port of Flash code!
  - Feel free to improve it, or hand-port your own. I'll happily accept the patch.
    That said, the code's fairly straightforward, and I'd be surprised if manual tweaking of it made much of a difference.
- Why haven't you updated to Box2D 2.3?
  - Because there do not appear to be updated versions of Box2dWeb, the Flash port, and the Dart port. One of the real
    benefits of using Box2d for this benchmark is that the ports are pretty structurally similar to the original C++
    version.


## Test platforms:

- Mac OS X: I'm using this. It works well.
- Linux: Others use this. It seems to work, but I don't personally test it.
- Windows: Can probably be cajoled into working, but will likely take a lot of manual labor. I prefer to build on my
  Mac then use the output files directly on a Windows box without building them there.


## Required tools:

- GCC or Clang: If you're running these benchmarks, you should know how to get this.
- JDK: I believe any JDK after 1.5 will work; I'm using 1.8.
- NaCl SDK: https://developers.google.com/native-client/sdk/download
- Emscripten: https://github.com/kripken/emscripten/wiki (there's a binary build available now)
- Flex SDK: http://www.adobe.com/devnet/flex/flex-sdk-download.html
- Adobe Crossbridge: http://adobe-flash.github.io/crossbridge/
- Dart SDK and Dartium: http://www.dartlang.org/tools/sdk/


## Environment variables (largely to locate the above tools):

- `$FLEX_SDK`: Flex SDK directory (e.g., `/opt/flex_sdk_4.6`)
- `$EMSCRIPTEN`: Directory containing the built emscripten compiler (e.g., `~/src/emcscripten`)
- `$LLVM`: Directory containing the `llvm` binaries (e.g., `/usr/local/bin`)
- `$NACL_SDK`: Directory containing the NaCl SDK version you want to use (e.g., `/opt/nacl_sdk/pepper_26`)
- `$CROSSBRIDGE`: (e.g., `/opt/crossbridge/sdk`)


## Targets:

- /c:
  - c: `make -f bench2d.mk; bench2d`
  - asm.js: `make -f bench2d.asmjs.mk` (open bench2d_asm.js.html -- in Firefox nightly to see asm.js optimizations)
  - nacl: `make -f bench2d.nacl.mk; python httpd.py` (open http://localhost:5103/bench2d_nacl.html in Chrome -- it won't work from a file:// url)
  - crossbridge: `./make-crossbridge; crossbridge_build/bench2d_crossbridge` (or open crossbridge_build/bench2d_crossbridge.swf in the standalone Flash Player)
- /java:
  - `ant run`
- /js:
  - `run-d8` (if you have V8's standalone shell, or open bench2d_run.html in your favorite browser)
- /as3:
  - `./build` (open Bench2d.html in your favorite browser, or Bench2d.swf in the standalone Flash Player)
  - (There's also a version that uses the "Nape" physics library, but this is not relevent to VM benchmarking)
- /dart:
  - `pub update; dart bench2d.dart`
- /dart (dart2js):
  - `dart2js -o bench2d.dart.js; open dart/bench2d.html in Dartium or another browser`


## Future work

- Make the timer resolution less bad.
- Find a way to automate the benchmarks.
- Benchmark IE9+.
- Benchmark .NET
