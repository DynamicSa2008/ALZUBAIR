# نشر موقع الزبير على السيرفر (WHM / cPanel)

الموقع يعمل على `https://trademarks-sa.com/`، والـ API (PHP + MySQL) يعمل من فولدر `api/` في نفس المكان.

## الإعداد لأول مرة

### 1. الدومين و SSL
- **الدومين:** لو الدومين مش مربوط بحساب cPanel، اعمله من WHM ← **Create a New Account**، أو من cPanel ← **Domains**. المجلد الجذري (Document Root) هو المكان اللي هترفع فيه الملفات، مثلًا `public_html` أو `trademarks-sa`.
- **SSL:** من cPanel ← **SSL/TLS Status** ← **Run AutoSSL**. لازم يتعمل قبل الرفع، لأن الموقع يحوّل الزوار لـ https تلقائيًا.

### 2. قاعدة البيانات
1. افتح cPanel ← **MySQL® Databases**.
2. **Create New Database:** مثلًا `alzubair`، وهتظهر باسم `CPANELUSER_alzubair`.
3. **Add New User:** اسم وكلمة مرور قوية.
4. **Add User To Database** ← اختار المستخدم والقاعدة ← **ALL PRIVILEGES**.

### 3. الرفع
1. على جهازك، من فولدر المشروع:
   ```bash
   npm install
   npm run package
   ```
   هيطلع ملف `alzubair-site.zip`.
2. افتح cPanel ← **File Manager** ← المجلد الجذري للدومين.
3. **Upload** للملف `alzubair-site.zip`، وبعدين كليك يمين ← **Extract**.

### 4. ملف الإعدادات السري
1. في File Manager ادخل فولدر `api`، وانسخ `config.sample.php` باسم `config.php`.
2. افتح `config.php` (**Edit**) واملأ:
   - `dsn`: غيّر `CPANELUSER_alzubair` لاسم قاعدة البيانات.
   - `user` / `pass`: مستخدم قاعدة البيانات وكلمة مروره.
   - `admin_password`: كلمة مرور لوحة التحكم (8 حروف وأرقام أو أكتر).
   - `mail_from`: إيميل على الدومين، مثلًا `no-reply@trademarks-sa.com`. يفضّل تعمله من cPanel ← **Email Accounts** عشان الرسايل ما تروحش spam.

### 5. التأكد
- **الـ API:** افتح `https://trademarks-sa.com/api/?action=health`، المفروض يظهر `"ok":true`. الجداول بتتعمل تلقائيًا أول مرة.
- **اللوحة:** افتح `https://trademarks-sa.com/dashboard` وادخل بكلمة المرور.
- **الإعدادات:** من «إعدادات الموقع» راجع الأرقام والإيميلات، ثم **نشر للزوار**.

## أي تحديث بعد كده
```bash
git pull
npm install
npm run package
```
ارفع `alzubair-site.zip` واعمله **Extract** فوق الملفات الموجودة (Overwrite).

**ممنوع تمسح الآتي** لأنه بياناتك الحية:
- `api/config.php` — الإعدادات السرية.
- `api/storage/` — إعدادات الموقع المنشورة.
- `uploads/` — صور وفيديوهات معرض الأعمال.

الملف المضغوط ما فيهوش أي منهم، فالـ Extract مش هيلمسهم.

## نسخ احتياطي
- **قاعدة البيانات:** cPanel ← **Backup** ← Download a MySQL Database Backup.
- **الملفات:** نزّل `api/storage` و `uploads` من File Manager (Compress ← Download).
- **الإعدادات:** من اللوحة ← «إعدادات الموقع» ← **تنزيل نسخة احتياطية**.

## لو الموقع في فولدر فرعي بدل الدومين مباشرة
مثلًا `https://trademarks-sa.com/trademarks-sa/`: أنشئ ملف `.env` في المشروع وفيه:
```
VITE_SITE_URL=https://trademarks-sa.com/trademarks-sa
VITE_BASE=/trademarks-sa/
```
بعدها `npm run package` وارفع الملف جوه الفولدر ده.

## مشاكل شائعة
| المشكلة | الحل |
|---|---|
| `/api/?action=health` بيرجّع `not-configured` | ملف `api/config.php` مش موجود. |
| بيرجّع `db-connect` | بيانات القاعدة غلط، أو المستخدم مش مربوط بالقاعدة بكل الصلاحيات. |
| الصفحات زي `/kyc` بتدي 404 | ملف `.htaccess` ما اترفعش. فعّل Settings ← Show Hidden Files وتأكد إنه موجود. |
| رفع الفيديو بيفشل | زوّد `upload_max_filesize` و `post_max_size` من cPanel ← **MultiPHP INI Editor** (مثلًا 64M). |
| الإيميلات مش بتوصل | اتأكد إن `mail_from` إيميل حقيقي على نفس الدومين، وراجع cPanel ← **Email Deliverability**. |
| اللوحة بتقول «محاولات كثيرة» | حماية ضد التخمين. استنى 15 دقيقة. |

النسخة المطلوبة PHP 7.4 أو أحدث، ويُفضّل 8.x، مع إضافات `pdo_mysql` و `mbstring` و `fileinfo`. تقدر تفعّلهم من cPanel ← **Select PHP Version** لو مش مفعّلين.
