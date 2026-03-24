# Discord Custom Rich Presence

Bu proje ile Discord'da o an ne yaptigini ozel olarak gosterebilirsin:
- `Playing ...` metnini istedigin gibi ayarlarsin (`DETAILS`, `STATE`)
- Logo degistirebilirsin (`LARGE_IMAGE_KEY`, `SMALL_IMAGE_KEY`)
- 2 adede kadar buton ekleyebilirsin

## 1) Discord App olustur

1. [Discord Developer Portal](https://discord.com/developers/applications) adresine gir.
2. `New Application` ile bir uygulama olustur.
3. `General Information` altindan **Application ID** al.
4. `Rich Presence > Art Assets` bolumune gidip logolari yukle.
5. Yukledigin her logonun `name` degerini not et (scriptte `*_IMAGE_KEY` olarak kullanilir).

## 2) Kurulum

```bash
npm install
```

## 3) Ayarlari yap

`.env.example` dosyasini `.env` olarak kopyala ve duzenle:

```bash
copy .env.example .env
```

Sonra `.env` icine kendi `CLIENT_ID`, metin, logo key ve butonlarini yaz.

## 4) Calistir

```bash
npm start
```

Discord uygulamasi aciksa Rich Presence gorunur.

## Notlar

- Butonlar icin URL zorunlu olarak `https://` ile baslamali.
- En fazla 2 buton desteklenir.
- Degisiklik yaptiktan sonra scripti yeniden baslat.
