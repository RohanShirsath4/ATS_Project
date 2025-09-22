import React from 'react'

const Footer = () => {
  return (
  <>

 
<footer className="container-fluid  bg-dark mt-5 h-50 ">
 
  <div className="py-6 py-md-8 py-xl-10 h-75">
    <div className="container">
      <div className=" ">
        <div className="col-12">
          <div className="footer-logo-wrapper text-center">
            <a href="#!">
              <img src="./assets/img/bsb-logo.svg" alt="BootstrapBrain Logo" width={153} height={50} />
            </a>
          </div>
        </div>
        <div className="col-12">
          <div className="link-wrapper">
            <ul className="m-0 list-unstyled d-flex justify-content-center gap-3">
              <li>
                <a href="#!" className="link-underline-opacity-0 link-opacity-75-hover link-underline-opacity-100-hover link-offset-1 link-dark link-opacity-75 fs-7">
                  Platform
                </a>
              </li>
              <li>
                <a href="#!" className="link-underline-opacity-0 link-opacity-75-hover link-underline-opacity-100-hover link-offset-1 link-dark link-opacity-75 fs-7">
                  Solutions
                </a>
              </li>
              <li>
                <a href="#!" className="link-underline-opacity-0 link-opacity-75-hover link-underline-opacity-100-hover link-offset-1 link-dark link-opacity-75 fs-7">
                  Resources
                </a>
              </li>
              <li>
                <a href="#!" className="link-underline-opacity-0 link-opacity-75-hover link-underline-opacity-100-hover link-offset-1 link-dark link-opacity-75 fs-7">
                  Pricing
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* Copyright - Bootstrap Brain Component */}
  <div>
    <div className="container">
      <div className="row gy-3 gy-sm-0 align-items-sm-center">
        <div className="col-sm-6">
          <div className="copyright-wrapper d-block mb-1 fs-9 text-center text-sm-start">
            © 2024. All Rights Reserved.
          </div>
          <div className="credit-wrapper d-block text-secondary fs-10 text-center text-sm-start">
            Built by<a href="https://bootstrapbrain.com/" className="link-secondary text-decoration-none">
              BootstrapBrain</a> with <span className="text-primary">♥</span>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="social-media-wrapper">
            <ul className="m-0 list-unstyled d-flex justify-content-center justify-content-sm-end gap-3">
              <li>
                <a href="#!" className="link-opacity-75-hover link-dark">
                  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" className="bi bi-youtube" viewBox="0 0 16 16">
                    <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z" />
                  </svg>
                </a>
              </li>
              <li>
                <a href="#!" className="link-opacity-75-hover link-dark">
                  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" className="bi bi-facebook" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
                  </svg>
                </a>
              </li>
              <li>
                <a href="#!" className="link-opacity-75-hover link-dark">
                  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" className="bi bi-twitter" viewBox="0 0 16 16">
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334q.002-.211-.006-.422A6.7 6.7 0 0 0 16 3.542a6.7 6.7 0 0 1-1.889.518 3.3 3.3 0 0 0 1.447-1.817 6.5 6.5 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.32 9.32 0 0 1-6.767-3.429 3.29 3.29 0 0 0 1.018 4.382A3.3 3.3 0 0 1 .64 6.575v.045a3.29 3.29 0 0 0 2.632 3.218 3.2 3.2 0 0 1-.865.115 3 3 0 0 1-.614-.057 3.28 3.28 0 0 0 3.067 2.277A6.6 6.6 0 0 1 .78 13.58a6 6 0 0 1-.78-.045A9.34 9.34 0 0 0 5.026 15" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</footer>


  </>
  )
}

export default Footer
