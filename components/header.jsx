import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../app/logo.png'
import dashboard from '../app/dashboard.png'
import pending from '../app/pending.png'
import verified from '../app/verified.png'
import decline from '../app/decline.png'

export default function HeaderBar() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1200);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header id="header" className="header fixed-top d-flex align-items-center">
      <div className="d-flex align-items-center justify-content-between">
        <Link href="/" className="logo d-flex align-items-center">
          <Image src={logo} width={30} height={30} alt="" />
          <span className="d-none d-lg-block">GetSente</span>
        </Link>
        <i className="bi bi-list toggle-sidebar-btn"></i>
      </div>

      {/* <div className="search-bar">
        <form className="search-form d-flex align-items-center" method="POST" action="#">
          <input type="text" name="query" placeholder="Search" title="Enter search keyword" />
          <button type="submit" title="Search"><i className="bi bi-search"></i></button>
        </form>
      </div> */}

      {isSmallScreen && (
        <nav className="header-nav ms-auto">
          <ul className="d-flex align-items-center">
            {/* <Link href="/" className="logo nav-icon  d-flex align-items-center">
              <Image src={dashboard} width={30} height={30} alt="" />
            </Link> */}
            <Link href="/loanRequests" className="mx-4 logo nav-icon d-flex align-items-center">
              <Image src={pending} width={50} height={50} alt="" />
            </Link>
            <Link href="/approvedLoans" className="mx-4 logo nav-icon d-flex align-items-center">
              <Image src={verified} width={50} height={50} alt="" />
            </Link>
            <Link href="/declinedLoans" className="mx-4 logo nav-icon d-flex align-items-center">
              <Image src={decline} width={50} height={50} alt="" />
            </Link>
          </ul>
        </nav>
      )}
    </header>
  );
};
