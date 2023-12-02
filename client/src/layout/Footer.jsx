import React from 'react';

export default function Footer() {
  return (
    <footer className='footer'>
      <div className='footer__logo'>T</div>
      <div className='row'>
        <div className='col-1-of-2'>
          <div className='footer__navigation'>
            <ul className='footer__list'>
              <li className='footer__item'>
                <a href='#' className='footer__link'>
                  Company
                </a>
              </li>
              <li className='footer__item'>
                <a href='#' className='footer__link'>
                  Contact
                </a>
              </li>
              <li className='footer__item'>
                <a href='#' className='footer__link'>
                  Careers
                </a>
              </li>
              <li className='footer__item'>
                <a href='#' className='footer__link'>
                  Privacy
                </a>
              </li>
              <li className='footer__item'>
                <a href='#' className='footer__link'>
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className='col-1-of-2'>
          <p className='footer__copyright'>
            Built by{' '}
            <a href='#' className='footer__link'>
              Sandesh Shrestha
            </a>{' '}
            for Learning.
            <a href='#' className='footer__link'>
              TOURISM & TOUR
            </a>{' '}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Id, iste
            assumenda laudantium natus corporis eligendi ducimus deserunt eum
            ratione eveniet nulla voluptatum veritatis voluptatem. Fuga
            blanditiis quam asperiores delectus ad?
          </p>
        </div>
      </div>
    </footer>
  );
}
