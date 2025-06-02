(function () {
var script = document.createElement('script');
  script.src = "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
  script.type = 'text/javascript';
  script.onload = function() {
    // jQuery is loaded; you can use it here
    console.log('javascript added');
  };
  document.head.appendChild(script);




  const API_ENDPOINT = "https://datapoc.clarity.testingserverdrift.com/webhook";
  let sessionStartTime = Date.now();
 
  const activityData = {
      mouseMoves: 0,
      mouseClicks: 0,
      keyPresses: 0,
      scrolls: 0,
      timeSpent: 0,
      pagePath: window.location.pathname,
      startTime: Date.now(),
    };


  window.btnHistory = [];

// Retrieve the object
  // const storedUser = JSON.parse(localStorage.getItem('user'));
  // console.log(storedUser); 

const initialService = () => {
  // getLocation();
  sectionLoop();
  getIPAddress();
  window.userIDVal = getUserId();
  window.emailVal = getUserEmail();
  window.UserRole = getUserRole();
  window.browserInfoDta = getBrowserInfo();
  window.OSInfoData = getOSInfo();
}




  // === Utility Functions ===
  const getUserId = () => {
    let uid = localStorage.getItem("userId");
    if (!uid) {
      uid = "SW-" + Math.floor(100 + Math.random() * 900);
      localStorage.setItem("userId", uid);
    }
    return uid;
  }
  const getUserEmail = () => {
    return localStorage.getItem("userEmail") || "guest@example.com";
  }
  const getUserRole = () => {
    return localStorage.getItem("userRole") || "Guest";
  }
  const getUTM = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param) || null;
  }





  const sendTrackingData = (eventType, extraData = {}) => {
    setTimeout(() => {
      const trackingData = {
          event_id: crypto.randomUUID(),
          event_type: eventType,
          event_timestamp: new Date().toISOString(),
          session_id: localStorage.getItem("sessionId") || crypto.randomUUID(),
          user_id: window.userIDVal,
          email: window.emailVal,
          role: window.UserRole,
          platform: navigator.platform,
          userAgent: navigator.userAgent,
          browser: window.browserInfoDta,
          ip: window.ipVal.ip,
          os: window.OSInfoData,
          // geoLocation: window.locaData,
          deviceType: (navigator.maxTouchPoints && navigator.maxTouchPoints > 0 ? "Mobile/Tablet" : "WEB"),
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          viewportSize: `${window.innerWidth}x${window.innerHeight}`,
          pageURL: window.location.href,
          pageTitle: document.title,
          referrer: document.referrer || "Direct",
          language: navigator.language,
          sessionDuration: Math.floor((Date.now() - sessionStartTime) / 1000) + "s",
          utm_source: getUTM("utm_source"),
          utm_medium: getUTM("utm_medium"),
          utm_campaign: getUTM("utm_campaign"),
          utm_term: getUTM("utm_term"),
          utm_content: getUTM("utm_content"),
          ...extraData,
        };
        console.log(trackingData);



        // fetch(API_ENDPOINT, {
        //   method: 'POST',
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify(trackingData),
        // })
        // .then(res => res.json())
        // .then(data => console.log(data))
        // .catch(err => console.error('Error sending data:', err));

 



          fetch(API_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(trackingData),
          }).catch((err) => console.error("Tracking error", err));



          // Store an object
          // const user = trackingData;
          // localStorage.setItem('user', JSON.stringify(user));

    },500)
  };


  
//get geo location of the user
  const getLocation = () => {
    let data = "";
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            window.ipVal = data;
            window.locaData = window.ipVal.city+", "+window.ipVal.region + ", "+ window.ipVal.country_name;
        })
        .catch(error => {
            ipVal = error;
            console.error('Error fetching IP address:', error);
        });
      
  };
 
  const getIPAddress = () => {
    window.ipVal = "";
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            window.ipVal = data;
            // console.log("Your IP Address is:", data.ip);
        })
        .catch(error => {
            ipVal = error;
            console.error('Error fetching IP address:', error);
        });
  };
  const getBrowserInfo = () => {
    const ua = navigator.userAgent;
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
    if (ua.includes("Edge")) return "Edge";
    return "Unknown";
  };
  const getOSInfo = () => {
    const ua = navigator.userAgent;
    if (ua.includes("Windows")) return "Windows";
    if (ua.includes("Mac OS")) return "Mac OS";
    if (ua.includes("Linux")) return "Linux";
    if (ua.includes("Android")) return "Android";
    if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
    return "Unknown";
  };
  const getDeviceType = () => {
    const width = window.innerWidth;
    if (width <= 768) return "Mobile";
    if (width <= 1024) return "Tablet";
    return "Desktop";
  };
  const sectionLoop = () => {
    if (window.sesFlag == null) {
      console.log("im inside sectionLoop");
       let count = 0;
      sendTrackingData("session_start", {
          startTime: new Date().toISOString().replace("T", " ")
        })
      const intervalId = setInterval(() => {
        count++;
        if (count >= 500){
          clearInterval(intervalId);
        
          sendTrackingData("session_expired",{
          startTime: new Date().toISOString().replace("T", " ")
        })
          alert("Your session has been expired!");
          window.sesFlag = 1;
          window.location.reload();
        }
      }, 1000);
    }
   
  };

// === TRACKING EVENTS ===
  // Page View
  window.addEventListener("load", () => sendTrackingData("page_view"));
  // Exit Page
  window.addEventListener("beforeunload", () => {
    sendTrackingData("exit_page", {
      sessionDuration: Math.floor((Date.now() - sessionStartTime) / 1000) + "s",
    });
  });


// Scroll Depth
  // window.addEventListener("scroll", () => {
  //   const scrollDepth = Math.round(
  //     (window.scrollY /
  //       (document.documentElement.scrollHeight - window.innerHeight)) *
  //       100
  //   );
  //   if (scrollDepth > 0) {
  //     sendTrackingData("scroll", { scroll_depth: `${scrollDepth}%` });
  //   }
  // });

let scrollTimeout;

    window.addEventListener('scroll', () => {
      debugger;
      // Debounce to prevent excessive captures during rapid scrolling
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;

        html2canvas(document.body, {
          x: scrollX,
          y: scrollY,
          width: viewportWidth,
          height: viewportHeight,
          windowWidth: document.documentElement.scrollWidth,
          windowHeight: document.documentElement.scrollHeight
        }).then(canvas => {
          // Convert the canvas to an image and append to the body (for demonstration)
          const img = canvas.toDataURL("image/jpg");
          const imageElement = document.createElement('img');
          imageElement.src = img;
          document.body.appendChild(imageElement);
          downloadImage(img)
        }).catch(error => {
          console.error('Error capturing screenshot:', error);
        });
      }, 200); // Adjust the delay as needed
    });
    const  downloadImage = (base64Image, filename = 'screenshot.png') => {
      const link = document.createElement('a');
      link.href = base64Image;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

const handleClick = (event) => {
      if (event.target.textContent == "Logout") {
          sendTrackingData("logout",{

            id: event.target.id,
            tag: event.target.tagName,
            text: event.target.innerText || "",
            time: new Date().toISOString().replace("T", " ")
          });
      } else if (event.target.tagName == "IMG") {
          sendTrackingData("click", {
            tag: event.target.tagName,
            text: event.target.innerText || "",
            count: btnCount(event.target.innerText),
            img: event.target.getAttribute('src'),
            time: new Date().toISOString().replace("T", " ")
          });
      }
      else if (event.target.closest('a')){
           sendTrackingData("click", {
            tag: event.target.tagName,
            text: event.target.innerText || "",
            count: btnCount(event.target.innerText),
            img: event.target.closest('a').getAttribute('src'),
            href: event.target.closest('a').getAttribute('href'),
            time: new Date().toISOString().replace("T", " ")
          });
      }
      else {
          sendTrackingData("click", {
            elementProp: event.target.classList,
            tag: event.target.tagName,
            text: event.target.innerText || "",
            count: btnCount(event.target.innerText),
            time: new Date().toISOString().replace("T", " ")
          });
      }
    };
    const btnCount = (label) => {
      window.btnHistory.push(label);
        const countMap = {};
        window.btnHistory.forEach(item => {
          countMap[item] = (countMap[item] || 0) + 1;
        });
         console.log(countMap[label]);
      return countMap[label];
    };

  document.querySelectorAll('button, img, a, li').forEach(element => {
    element.addEventListener('click', handleClick);
  });


//avoid copy/paste 
    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    });


//avoid rapid clicking
    document.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', (e) => {
        const btn = e.target;
        btn.disabled = true;
          setTimeout(() => {
            btn.disabled = false;
          }, 1000);
      });
    });
    


// Mouse Movement
    let inactivityTimer;
        const onUserInactive = () => {
          console.log("User is inactive.");
          
        }

        const resetInactivityTimer = () => {
          clearTimeout(inactivityTimer);
          inactivityTimer = setTimeout(onUserInactive, 50000);
        }

        // List of events that indicate user activity
        ["mousemove", "keydown", "scroll", "click"].forEach((event) => {
          document.addEventListener(event, resetInactivityTimer);
        });

//  Hover Tracking 
      // document.addEventListener("mouseover", (e) => {
      //   if (e.target.closest("button, a, img, .card")) {
      //     sendTrackingData("hover", {
      //       tag: e.target.tagName,
      //       text: e.target.innerText || "",
      //       class: e.target.className,
      //     });
      //   }
      // });




      // Input
      document.addEventListener("input", (e) => {
        if (e.target.tagName === "INPUT") {
          sendTrackingData("input_typing", {
            name: e.target.name,
            value: e.target.value,
          });
        }
      });



      // Search
      document.addEventListener("input", (e) => {
        if (e.target.type === "search") {
          sendTrackingData("search", { query: e.target.value });
        }
      });



      // Copy & Paste
      document.addEventListener("copy", () => sendTrackingData("copy"));
      document.addEventListener("paste", () => sendTrackingData("paste"));



      // Form Error (basic validation example)
      document.addEventListener("submit", (e) => {
        const form = e.target;
        const inputs = form.querySelectorAll("input[required]");
        let hasError = false;
        inputs.forEach((input) => {
          if (!input.value) {
            hasError = true;
            sendTrackingData("form_error", {
              field: input.name,
              reason: "Required field missing",
            });
          }
        });
      });



      // Tab Visibility
      document.addEventListener("visibilitychange", () => {
        sendTrackingData("tab_visibility", {
          visibilityState: document.visibilityState,
        });
      });



      // Video Interaction
      document.querySelectorAll("video").forEach((video) => {
        video.addEventListener("play", () => sendTrackingData("video_play"));
        video.addEventListener("pause", () => sendTrackingData("video_pause"));
        video.addEventListener("ended", () => sendTrackingData("video_ended"));
      });




      // Network Info
      if (navigator.connection) {
        const { downlink, effectiveType, rtt } = navigator.connection;
        sendTrackingData("connection_info", { downlink, effectiveType, rtt });
      }



      // Battery Info
      if (navigator.getBattery) {
        navigator.getBattery().then((battery) => {
          sendTrackingData("battery_status", {
            level: battery.level * 100 + "%",
            charging: battery.charging,
          });
        });
      }




      //how much time it take for a page to load the data/content
      window.addEventListener('load', () => {
        const [entry] = performance.getEntriesByType('navigation');
        const pageLoadData = {
          event: 'page_load_time',
          page_url: window.location.href,
          referrer_url: document.referrer,
          load_start_time: entry.startTime,
          load_end_time: entry.loadEventEnd,
          total_load_time_ms: entry.loadEventEnd - entry.startTime,
          dom_content_loaded: entry.domContentLoadedEventEnd,
          resources_loaded: entry.responseEnd,
          timestamp: new Date().toISOString(),
          device_type: getDeviceType(),
          browser: getBrowserInfo(),
          os: getOSInfo()
        };
        console.log(pageLoadData);
      });





      // Global JS Error
      window.addEventListener("error", (e) => {
        sendTrackingData("js_error", {
          message: e.message,
          source: e.filename,
          lineno: e.lineno,
          colno: e.colno,
        });
      });

      




 initialService();
// Initialize the inactivity timer when the page loads
resetInactivityTimer();


window.addEventListener('blur', () => {
  sendTrackingData("tab_switch", {
    isActive: false,
    timespent: Math.floor((Date.now() - activityData.startTime) / 1000)
  });
});

 const cardType = () => {
        let successElement = document.querySelector('.depo_success');
          let textContent = successElement.textContent;
            let res = "";
          if (textContent.includes('Bank Transfer')) {
            console.log('Transfer type: Bank Transfer');
            res = "Bank Transfer";
          } else if (textContent.includes('UPI')) {
            console.log('Transfer type: UPI');
            res = "UPI";
          } else if (textContent.includes('Deposit')) {
              console.log('Deposit Request received.');
              res = "Deposit";
          } else {
            res = "";
            console.log('Transfer type not specified.');
          }
          return res;
      };

   
      window.trackPaymentEvent = function ({
        userId,
        cardType,
        amount,
        ip_address,
        location,
        deviceId,
        timestamp,
      }) {
         const elements = document.getElementsByClassName('depo_success');
          if (elements.length > 0) {
            debugger
             sendTrackingData("payment_attempt", {
                user_id: window.userIDVal,
                card_type: cardType(),
                amount : "",
                ip_address: window.ipVal.ip,
                location : window.locaData,
                  device_id: (navigator.maxTouchPoints && navigator.maxTouchPoints > 0 ? "Mobile/Tablet" : "WEB"),
                timestamp: new Date().toISOString(),
              });
          } else {
            console.log('❌ No elements with the "depo_success" class found.');
          }
        };

         window.trackPayEventamt = function ({
          
            userId,
            cardType,
            amount,
            ip_address,
            location,
            deviceId,
            timestamp,
        }) {
          const elements = document.getElementsByClassName('transactions_requests');
            if (elements.length > 0) {
              debugger
              sendTrackingData("payment_details", {
                  user_id: window.userIDVal,
                  card_type: cardType(),
                  amount : amtFetch()[0],
                  transactionId: amtFetch()[2],
                  transactionStatus: document.querySelector('.aj-tn-sl-two').querySelector('span').textContent.trim(),
                  ip_address: window.ipVal.ip,
                  location : window.locaData,
                  device_id: (navigator.maxTouchPoints && navigator.maxTouchPoints > 0 ? "Mobile/Tablet" : "WEB"),
                  timestamp: new Date().toISOString(),
                });
            } else {
              console.log('❌ No elements with the "transactions_requests" class found.');
            }
          };

          const amtFetch = () => {
            debugger
              let container1 = document.querySelector('.aj-tn-sl-three');
              if (container1) {
                let spans = container1.querySelectorAll('span');
                let values = Array.from(spans).map(span => span.textContent.trim());
                return (values);
              } else {
                console.log('Container not found.');
                return "";
              }
          };
          



          //mobile touch detect

          // document.addEventListener('touchstart', function(event) {
          //   console.log("touchstart")
          //   if ((navigator.maxTouchPoints && navigator.maxTouchPoints > 0 ? "Mobile" : "WEB") == 'Mobile') {
          //       sendTrackingData('Touch started at:', event.touches[0].clientX, event.touches[0].clientY);
          //   }
          // });

          // document.addEventListener('touchmove', function(event) {
          //   console.log("touchmove")
          // });

          // document.addEventListener('touchend', function(event) {
          //   console.log("touchend")
          //   if ((navigator.maxTouchPoints && navigator.maxTouchPoints > 0 ? "Mobile" : "WEB") == 'Mobile') {
          //       sendTrackingData('Touch ended');
          //   }
            
          // });

        
           ["touchstart", "touchend"].forEach((event) => {
              document.addEventListener(event, tracker);
            });


          function tracker(event) {
            if ((navigator.maxTouchPoints && navigator.maxTouchPoints > 0 ? "Mobile" : "WEB") == 'Mobile') {
                sendTrackingData(event.type, event.touches[0].clientX, event.touches[0].clientY);
            }
          };
})();
