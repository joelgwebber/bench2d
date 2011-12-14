#include <cstdio>
#include <string>
#include "ppapi/cpp/instance.h"
#include "ppapi/cpp/module.h"
#include "ppapi/cpp/var.h"

const char* const kBenchString = "bench";
const char* const kReplyString = "Benchmarks complete.";

void bench();

class Bench2dInstance : public pp::Instance {
 public:
  explicit Bench2dInstance(PP_Instance instance) : pp::Instance(instance) {}
  virtual ~Bench2dInstance() {}

  virtual void HandleMessage(const pp::Var& var_message) {
    if (!var_message.is_string())
        return;

    std::string message = var_message.AsString();
    pp::Var var_reply;
    if (message == kBenchString) {
      bench();
      var_reply = pp::Var(kReplyString);
      PostMessage(var_reply);
    }
  }
};

class Bench2dModule : public pp::Module {
 public:
  Bench2dModule() : pp::Module() {}
  virtual ~Bench2dModule() {}

  virtual pp::Instance* CreateInstance(PP_Instance instance) {
    return new Bench2dInstance(instance);
  }
};

namespace pp {

Module* CreateModule() {
  return new Bench2dModule();
}

}  // namespace pp

