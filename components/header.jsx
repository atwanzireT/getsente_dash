import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../app/logo.png'
import dashboard from '../app/dashboard.png'
import pending from '../app/pending.png'
import verified from '../app/verified.png'
import decline from '../app/decline.png'


export default function HeaderBar() {
  return (
    <header id="header" className="header fixed-top d-flex align-items-center">
      <div className="d-flex align-items-center justify-content-between">
        <Link href="/" className="logo d-flex align-items-center">
          <Image src={logo} width={30} height={30} alt="" />
          <span className="d-none d-lg-block">GetSente</span>
        </Link>
        <i className="bi bi-list toggle-sidebar-btn"></i>
      </div>

      <div className="search-bar">
        <form className="search-form d-flex align-items-center" method="POST" action="#">
          <input type="text" name="query" placeholder="Search" title="Enter search keyword" />
          <button type="submit" title="Search"><i className="bi bi-search"></i></button>
        </form>
      </div>

      <nav className="header-nav ms-auto">
        <ul className="d-flex align-items-center">
          {/* <Link href="/" className="logo nav-icon  d-flex align-items-center">
            <Image src={dashboard} width={30} height={30} alt="" />
          </Link> */}
          <Link href="/loanRequests" className="logo nav-icon d-flex align-items-center">
            <Image src={pending} width={30} height={30} alt="" />
          </Link>
          <Link href="/approvedLoans" className="logo nav-icon d-flex align-items-center">
            <Image src={verified} width={30} height={30} alt="" />
          </Link>
          <Link href="/declinedLoans" className="logo nav-icon d-flex align-items-center">
            <Image src={decline} width={30} height={30} alt="" />
          </Link>

        </ul>
      </nav>
    </header>
  );
};

