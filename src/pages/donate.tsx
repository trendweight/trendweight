/* eslint-disable @next/next/no-sync-scripts */
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "~/components/shared/Link";
import { Page } from "~/lib/core/page";

const Donate: Page = () => {
  const [kofiHtml, setKofiHtml] = useState("");
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const kofiwidget2 = (window as any).kofiwidget2;
    kofiwidget2.init("Buy me a Coffee", "#29abe0", "E1E44NN85");
    setKofiHtml(kofiwidget2.getHTML());
  }, []);
  return (
    <>
      <Head>
        <script type="text/javascript" src="https://storage.ko-fi.com/cdn/widget/Widget_2.js"></script>
      </Head>
      <div>
        <div className="hidden float-right pb-4 pl-4 bg-white md:block">
          <div className="w-72">
            <Image src="/assets/programming.svg" width={600} height={400} layout="intrinsic" />
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Want to help support TrendWeight?</h2>
          <p>
            TrendWeight is a free app. I created it in my free time because I like tech gadgets and I wanted a better
            way to apply the concepts of the Hacker's Diet to my own day-to-day life. I didn't create it in order to
            make money. However, from time to time, I get an email from someone asking if there is some way they can
            make a donation to help support TrendWeight.
          </p>
          <p>
            Since TrendWeight is a development project I work on in my free time, I don't have to pay employees to
            develop or maintain the site. But there are some small fees I pay each month for the servers and software
            that power TrendWeight. In the interest of transparency, let me tell you what those costs are.
          </p>
          <p>
            In fact, <Link href="https://trendweight.io">trendweight.io</Link> pretty inexpensive to run:
          </p>
          <ul className="pl-8 list-disc">
            <li>
              The website runs on <Link href="https://vercel.com">Vercel</Link>: <b>$20</b>
              /month
            </li>
            <li>
              Performance monitoring is <Link href="https://vercel.com/docs/analytics">Vercel Analytics</Link>:{" "}
              <b>$10</b>
              /month
            </li>
            <li>
              The database and authentication is on <Link href="https://firebase.google.com/pricing">Firebase</Link>:{" "}
              <b>$0</b>/month
            </li>
          </ul>
          <p>
            In total, my monthly expenses are <b>$30</b>/month.
          </p>
          <p>
            Let me be <span className="font-semibold">crystal clear</span>: I don't need help paying for TrendWeight. I
            can afford to run TrendWeight out of my own pocket. I only have this page because people kept emailing me
            asking how to support the site. If you really want to help, there are a few ways I can suggest...
          </p>
          <div className="inset-0 flex items-center pb-3 pt-4" aria-hidden="true">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <h2 className="text-xl font-bold">Tip me with Ko-fi</h2>
          <p>Ko-fi lets you use a credit card, Paypal, or Apple Pay.</p>
          <div dangerouslySetInnerHTML={{ __html: kofiHtml }} />
          <div className="inset-0 flex items-center pb-3 pt-4" aria-hidden="true">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <h2 className="text-xl font-bold">Or send a tip directly</h2>
          <p>If you like, you can also send me a small tip directly on PayPal or Venmo:</p>
          <ul className="pl-8 list-disc">
            <li>
              Venmo: <Link href="https://venmo.com/code?user_id=2181966380138496050">ErvWalter</Link>
            </li>
            <li>
              PayPal: <Link href="https://paypal.me/erv">erv@ewal.net</Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

Donate.title = "Donate";

export default Donate;
