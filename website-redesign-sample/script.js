diff --git a/D:\Minecraft\Block-Panel-V2\Block-Panel-V2\website-redesign-sample\script.js b/D:\Minecraft\Block-Panel-V2\Block-Panel-V2\website-redesign-sample\script.js
new file mode 100644
--- /dev/null
+++ b/D:\Minecraft\Block-Panel-V2\Block-Panel-V2\website-redesign-sample\script.js
@@ -0,0 +1,29 @@
+const tourTabs = Array.from(document.querySelectorAll(".tour-tab"));
+const tourPanels = Array.from(document.querySelectorAll(".tour-panel"));
+const trustTabs = Array.from(document.querySelectorAll(".trust-tab"));
+const trustPanels = Array.from(document.querySelectorAll(".trust-panel"));
+
+function activateGroup(tabList, panelList, key, value) {
+  tabList.forEach((tab) => {
+    const active = tab.dataset[key] === value;
+    tab.classList.toggle("active", active);
+    tab.setAttribute("aria-selected", active ? "true" : "false");
+  });
+
+  panelList.forEach((panel) => {
+    const active = panel.dataset[`${key}Panel`] === value || panel.dataset.panel === value;
+    panel.classList.toggle("active", active);
+  });
+}
+
+tourTabs.forEach((tab) => {
+  tab.addEventListener("click", () => {
+    activateGroup(tourTabs, tourPanels, "tour", tab.dataset.tour);
+  });
+});
+
+trustTabs.forEach((tab) => {
+  tab.addEventListener("click", () => {
+    activateGroup(trustTabs, trustPanels, "trust", tab.dataset.trust);
+  });
+});
