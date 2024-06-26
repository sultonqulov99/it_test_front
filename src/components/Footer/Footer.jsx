import React from 'react';

const Footer = () => {
  return (
    <footer class="site-footer  py-3">
      <div class="container px-4">
          <div class="row justify-content-between">
              <div class="col-12 col-md-3 mb-2">
                  <div class="footer-mail text-center">
                      <i class="fal fa-envelope footer-mail__icon"></i>
                      <a href="doniyorjonibekov1995@gmail.com" class="footer-mail__link">doniyorjonibekov1995@gmail.com</a>
                  </div>
              </div>
              <div class="col-6 col-md-3 mb-2">
                  <div class="footer-phone text-end">
                      <i class="fal fa-phone-alt footer-phone__icon"></i>
                      <a href="tel:998994768495" class="footer-phone__link">(99899) 476-84-95</a>
                  </div>
              </div>
              <div class="col-6 col-md-3 mb-2 ">
                  <ul class="footer-social social d-flex justify-content-start justify-content-lg-end">
                     <li class="social-item">
                      <a href="#!" class="social-link">
                          <i class="fab fa-facebook-f  social-icon"></i>
                      </a>
                     </li>
                     <li class="social-item">
                      <a href="https://www.instagram.com/itlive_guliston/" class="social-link">
                          <i class="fab fa-instagram  social-icon"></i>
                      </a>
                     </li>
                     <li class="social-item">
                      <a href="https://t.me/IT_LIVE_GULISTON" class="social-link">
                          <i class="fab fa-telegram  social-icon"></i>
                      </a>
                     </li>
                     <li class="social-item">
                      <a href="@IT_LIVE" class="social-link">
                          <i class="fab fa-youtube  social-icon"></i>
                      </a>
                     </li>
                  </ul>
              </div>
          </div>

          <p class="by-company">Sayt <a href="https://itlive.uz/" class="company-sayt">IT LIVE</a>tamonidan ishlab chiqilgan</p>
      </div>
      </footer>
  );
};

export default Footer;
