import React from "react";
import {
  Sparkles,
  Bell,
  Share2,
  MessageSquare,
  MoreHorizontal,
  Plus,
  HelpCircle,
  LogOut,
  LineChart,
  Paperclip,
  Mic,
  Send,
  Bot,
} from "lucide-react";

export default function AIAssistant() {
  return (
    <div className="flex flex-col h-full bg-white relative">
      <header className="h-16 border-b border-slate-200 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Sparkles className="text-primary" size={20} />
          <h2 className="text-lg font-bold tracking-tight">离职风险分析</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            <div
              className="size-8 rounded-full border-2 border-white bg-slate-200 bg-cover"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAbCbpZm5LaZdBmN-7vW1fHSLeR5lMsP7EjujnxGG3--Ne3qp7ywJuKQzoGQHTpJOM0qcfc_sZT8Jx4Ahivc3wa5qH643mm6Zj0xg-bX7rIyuoY1xJ8-ayB-ZsDEOLAa8z1W2bblgjDHibm2J9EIuEe66WXQe1D1ZJ8LOeJXqbBsc0mH-FD_UuLOzpeo_CwPM5JFizmkfvWDs8dAtgxuox-BXNC2vYbKtZ9M7K8fpOMvCME4x2C8NZsahZYuN7-78kQX0TLgHXuOsiS')",
              }}
            ></div>
            <div
              className="size-8 rounded-full border-2 border-white bg-slate-300 bg-cover"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDC2j5PZSiAcBSuoVnlB7sd49yZk7JALrBZXbtfwgh85KFXnAskV7nr0TGTyobIj7q-rL8qzN_3pcLJ-pRvaPk-l0M5noJBlsOdGFg5t6GcDoLr8UWp1SnwG-2XrAinjkgeIoTfckDrdy1gGQK3mtVPmB76YCU2eE5UAlNtigJnLSDjf-t_mVCiJ8c8fQxxwHiiIyOKZrM2qqmUa4kwMoWuT9G5Uge2Am8x7DVH3AgvAKhyT4RVsHZ8tScK24QqeV2sXm0gPubOZbTf')",
              }}
            ></div>
            <div className="size-8 rounded-full border-2 border-white bg-primary flex items-center justify-center text-[10px] text-white font-bold">
              +12
            </div>
          </div>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
            <Bell size={20} />
          </button>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
            <Share2 size={20} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-8 max-w-5xl mx-auto w-full">
        <div className="flex justify-end gap-4">
          <div className="max-w-[80%] bg-primary text-white p-4 rounded-2xl rounded-tr-none shadow-sm">
            <p className="text-sm leading-relaxed">
              显示工程部第四季度的离职风险分析。我想查看高风险员工及其关键驱动因素。
            </p>
          </div>
          <div
            className="size-10 rounded-full bg-slate-200 flex-shrink-0 bg-cover"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDtuNG4fx78h3qKCpXBD2lKSBpg8_7LP9gs3o0tfPbpqmiDrTzhEF3SruyB-Ch0mJCWlhTzYkH-ws90Fkb_fiKAyiT0SkyMQ0c4xrOTOAv3uLIm4cme2KYYmmZBND8BLz8oRXAgkUcqv_VgzI-vlmb1eTT4MJDTcIG-eghOGP7Wfh5yedBUAR_3e1zNIRkHhPKXgugg4z790qEM_xrK4h0Mypbhkez03szmLRZ4tGtcMQCCM_v3rA_f4TAU0LDTb_wr-4JRWqyjN4HH')",
            }}
          ></div>
        </div>

        <div className="flex gap-4">
          <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Bot className="text-primary" size={24} />
          </div>
          <div className="flex-1 space-y-6 max-w-[90%]">
            <div className="bg-slate-50 p-6 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
              <p className="text-sm text-slate-700 mb-6 leading-relaxed">
                根据最近的敬业度得分、薪资基准和项目完成数据，以下是工程部的离职风险概况。整体部门风险相比第三季度增加了{" "}
                <span className="text-red-500 font-bold">12%</span>。
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wide">
                    Risk Driver Distribution
                  </h4>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span>薪资差异</span>
                        <span className="text-primary">45%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-full w-[45%]"></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span>工作生活平衡</span>
                        <span className="text-primary">30%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-full w-[30%]"></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span>缺乏晋升空间</span>
                        <span className="text-primary">25%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-full w-[25%]"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wide">
                    High-Risk Profiles
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div
                          className="size-8 rounded-full bg-slate-100 bg-cover"
                          style={{
                            backgroundImage:
                              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuABZAPe8qNsC10IvOuKCSpqiFPqzRyGl-L_-CYnhGY9Y0NjKOOy3PV4v3HA5kgzZrdH6DW2TlxAGXKIc4CvYm_U73G60ELZYElzRUNxuNR4SnMLnk1Xu9g0XqbhOsxMoLuG6VAgrGfvKXt3sbRvV3S_x3UJzUxFUMPUmklViEmHXPyTOH9syW43GSLgJ-4DF6vftM7TjORwZKySWjbqdRUsD-WMyEqp_tULTUruKxEkcFundyhVhiYUqG9gL4aDdWktFxtGCn1OdVpi')",
                          }}
                        ></div>
                        <div>
                          <p className="text-xs font-bold">Sarah Miller</p>
                          <p className="text-[10px] text-slate-500">
                            Sr. Backend Engineer
                          </p>
                        </div>
                      </div>
                      <div className="px-2 py-0.5 rounded bg-red-100 text-red-600 text-[10px] font-bold">
                        极高风险
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div
                          className="size-8 rounded-full bg-slate-100 bg-cover"
                          style={{
                            backgroundImage:
                              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDakzYtUlvlGFaLXBLnG-KhfUM0nO977pceWGdonE4eny0KO4FTNpnCmwTDfJB9ToLZX89cIZrQzaptN_7Y2EdvtybO1E3kLTjGdzAZbqH1a7l8U49lDgTOXr8lSRTJ69RRJnh7-YBILzKCt6P6kSE-3RpCGjNXGI6HymPVVJ_ci52iQUqRzdfH6rqwLlHrdGR3DrVeV9M6fAI1c9NRqQwLrFia8xoL8DrC65iXvo_STHyF4BXXUmyNyGQP_g2Al3WGnMe8zU9xK3Wn')",
                          }}
                        ></div>
                        <div>
                          <p className="text-xs font-bold">James Chen</p>
                          <p className="text-[10px] text-slate-500">
                            Product Designer
                          </p>
                        </div>
                      </div>
                      <div className="px-2 py-0.5 rounded bg-orange-100 text-orange-600 text-[10px] font-bold">
                        高风险
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div
                          className="size-8 rounded-full bg-slate-100 bg-cover"
                          style={{
                            backgroundImage:
                              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuATvBcE42IfQfMvziyJ8DfNredQeQMcCmdoEvCJ_F3Qy1tdGv0HkgtGUJ6X8VR3fnmcoq8b570BbLYFcuN9dJmYzdRaBtQfEEsGNSVM1dKLKipjq8Fkwd1WvZoBl09Q6wxs2o2U-NkXRtyLGpHAu1lb4HiwfHyCadJmMNkg0bWlS9zDBDZ9nmFQE3XaFTWLsI2n1aJ4VDZClTpyU3MZByQMz_ljpcX8Llq0wYUGspb3LPATAJ2lvzz-EjubMr7qt9ByGnHFwkYorz6T')",
                          }}
                        ></div>
                        <div>
                          <p className="text-xs font-bold">Elena Rodriguez</p>
                          <p className="text-[10px] text-slate-500">
                            DevOps Lead
                          </p>
                        </div>
                      </div>
                      <div className="px-2 py-0.5 rounded bg-orange-100 text-orange-600 text-[10px] font-bold">
                        高风险
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
              <button className="whitespace-nowrap px-3 py-1.5 rounded-full border border-primary/30 text-primary text-xs font-medium hover:bg-primary/5">
                解释方法论
              </button>
              <button className="whitespace-nowrap px-3 py-1.5 rounded-full border border-primary/30 text-primary text-xs font-medium hover:bg-primary/5">
                生成 PDF 报告
              </button>
              <button className="whitespace-nowrap px-3 py-1.5 rounded-full border border-primary/30 text-primary text-xs font-medium hover:bg-primary/5">
                显示薪酬基准
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-4 animate-pulse">
          <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
            <Bot className="text-slate-300" size={24} />
          </div>
          <div className="bg-slate-50 h-12 w-32 rounded-2xl rounded-tl-none border border-slate-100 flex items-center justify-center">
            <div className="flex gap-1">
              <div className="size-1.5 bg-slate-300 rounded-full"></div>
              <div className="size-1.5 bg-slate-300 rounded-full"></div>
              <div className="size-1.5 bg-slate-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <LineChart
                className="text-slate-400 group-focus-within:text-primary transition-colors"
                size={20}
              />
            </div>
            <input
              type="text"
              placeholder="向我询问员工数据、留存率或多样性指标..."
              className="block w-full pl-12 pr-24 py-4 bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:ring-0 focus:bg-white rounded-2xl text-sm transition-all shadow-sm outline-none"
            />
            <div className="absolute inset-y-0 right-2 flex items-center gap-1">
              <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
                <Paperclip size={20} />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
                <Mic size={20} />
              </button>
              <button className="ml-2 size-10 bg-primary hover:bg-primary/90 text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 transition-transform active:scale-95">
                <Send size={18} />
              </button>
            </div>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-3 font-medium">
            EDP AI 可以分析历史数据以预测趋势。请务必与 HR
            领导层核实关键业务决策。
          </p>
        </div>
      </div>
    </div>
  );
}
