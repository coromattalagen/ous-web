# ملاحظات أمنية — أكاديمية أوس
## Security Notes — OUS Academy site

تم تطبيق هذه الإجراءات وفق معايير عالمية معروفة، مجانية، ومستخدمة فعلياً من قبل صناع المواقع ومختصي أمن المعلومات:
Applied per well-known, free, globally-used, real-world standards:

- **OWASP Secure Headers Project** — owasp.org/www-project-secure-headers
- **Mozilla Observatory** best-practice header set — developer.mozilla.org / observatory
- **RFC 9116 (security.txt)** — الإطار الرسمي المعتمد من IETF للإفصاح الأمني
- **OWASP Top 10** — بنود ذات صلة بمواقع من نوع static/front-end

---

## ما تم تطبيقه فعلياً / What was actually implemented

1. **Content-Security-Policy** (عبر meta + عبر ملفات headers للاستضافة) — يمنع تحميل أي سكربت من مصدر غير موثوق. لا يوجد أي `<script>` inline أو `onclick=` في الموقع بأكمله، لذا `script-src 'self'` صارم بدون أي استثناء.
2. **Referrer-Policy: strict-origin-when-cross-origin** — يقلل تسرب معلومات الصفحة عند الانتقال لموقع خارجي.
3. **جميع الروابط الخارجية** (السوشال ميديا) تحمل `rel="noopener noreferrer"` لمنع هجمات `window.opener` tab-nabbing.
4. **X-Frame-Options / Strict-Transport-Security / Permissions-Policy / X-Content-Type-Options** — موجودة في 3 ملفات إعداد جاهزة حسب نوع الاستضافة (انظر أدناه)، لأن هذه الرؤوس **لا تعمل عبر meta tag إطلاقاً** — يجب أن تُرسل من الخادم فعلياً.
5. **security.txt** (RFC 9116) في `/.well-known/security.txt` — يخبر الباحثين الأمنيين كيف يبلغون عن ثغرة بدل نشرها علناً.
6. **نموذج التواصل**: حقل Honeypot مخفي (يكشف البوتات تلقائياً)، حدود طول للحقول (`maxlength`)، تحقق أساسي من جهة العميل.
7. **robots.txt + sitemap.xml** — حماية أساسية من فهرسة غير مقصودة + صحة SEO.

---

## ملفات الإعداد الثلاثة — استخدم واحداً منها حسب استضافتك
## Three config files — use whichever matches your host

| الملف | يُستخدم مع |
|---|---|
| `_headers` | Netlify, Cloudflare Pages |
| `.htaccess` | استضافة Apache التقليدية |
| `vercel.json` | Vercel |

فقط ملف واحد سيُفعَّل فعلياً حسب مكان النشر — الباقي غير مؤذٍ ويبقى بلا تأثير.
Only the file matching your actual host takes effect; the others are simply ignored.

---

## ما هو خارج نطاق موقع ثابت (Static Site) — يتطلب عملاً إضافياً لاحقاً
## What's out of scope for a static site — needs follow-up once you add a backend

- نموذج التواصل حالياً **واجهة أمامية فقط** — بمجرد ربطه بخادم حقيقي (CRM، بريد، API)، يجب:
  - تحقق من المدخلات من جانب الخادم (لا تكتفِ بالتحقق في المتصفح أبداً)
  - Rate limiting لمنع إغراق النموذج بالطلبات
  - حماية CSRF إن استُخدمت جلسات/كوكيز
  - إضافة hCaptcha أو reCAPTCHA إذا استمر السبام رغم الـ honeypot
- شهادة **HTTPS/TLS** يوفرها مزود الاستضافة (Netlify وVercel وCloudflare توفرها تلقائياً ومجاناً)
- عنوان `security@ousacademy.com` في ملف security.txt هو **عنوان افتراضي** — استبدله ببريد فعلي تراقبه.
- لم يتم فحص الموقع فعلياً عبر Mozilla Observatory أو Google Safe Browsing لعدم توفر نطاق (domain) منشور بعد — يُنصح بذلك فور الإطلاق.
