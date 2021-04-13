import Image from "next/image";
import Link from "~/components/shared/Link";
import { Page } from "~/lib/core/page";

const Donate: Page = () => {
  return (
    <div>
      <div className="hidden float-right pb-4 pl-4 bg-white md:block">
        <div className="w-72">
          <Image src="/assets/programming.svg" width={600} height={400} layout="intrinsic" />
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Want to help support TrendWeight?</h2>
        <p>
          TrendWeight is a free app. I created it in my free time because I like tech gadgets and I wanted a better way
          to apply the concepts of the Hacker's Diet to my own day-to-day life. I didn't create it in order to make
          money. However, from time to time, I get an email from someone asking if there is some way they can make a
          donation to help support TrendWeight.
        </p>
        <p>
          Since TrendWeight is a development project I work on in my free time, I don't have to pay employees to develop
          or maintain the site. But there are some small fees I pay each month for the servers and software that power
          TrendWeight. In the interest of transparency, let me tell you what those costs are.
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
            Performance monitoring is <Link href="https://vercel.com/docs/analytics">Vercel Analytics</Link>: <b>$10</b>
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
          Let me be <span className="font-semibold">crystal clear</span>: I don't need donations. I can afford to run
          TrendWeight out of my own pocket. I only have this donation page because people kept emailing me asking how to
          donate. If you really want to help, there are a few ways I can suggest...
        </p>
        <div className="inset-0 flex items-center pb-3 pt-4" aria-hidden="true">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <h2 className="text-xl font-bold">Buy stuff on Amazon</h2>
        <p>
          <div className="hidden float-right pb-4 pl-4 bg-white md:block">
            <div className="w-60">
              <Image src="/assets/amazon.svg" width={1000} height={301} layout="intrinsic" />
            </div>
          </div>
          The easiest way to support TrendWeight is to buy stuff on Amazon after following the links on this page. This
          is my favorite solution because we both get something out of it. You get the products that you were going to
          buy anyway, and I get a small reward from Amazon for sending you to their site (note, this doesn't cost you
          anything or increase the price you pay for your items).
        </p>
        <p>
          If you plan to buy a FitBit device or a Withings device, and you click on one of the links below to do so,
          Amazon will give me a small percentage of the purchase price as a thank you. This works for other items as
          well, so feel free to click on the Amazon homepage link below as well for any other items you plan to
          purchase.
        </p>
        <ul className="clear-both p-4 pl-8 max-w-lg bg-brand-50 border border-brand-100 rounded-md list-disc">
          <li>
            <Link href="https://amzn.to/3mOSng0">Buy Withings Products</Link>
          </li>
          <li>
            <Link href="https://amzn.to/3mGK8T2">Buy Fitbit Products</Link>
          </li>
          <li>
            Or go to the <Link href="https://amzn.to/3uIvcGM">Amazon</Link> homepage (where you can search for any
            product)
          </li>
        </ul>
        <div className="inset-0 flex items-center pb-3 pt-4" aria-hidden="true">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <h2 className="text-xl font-bold">Support TrendWeight via PayPal</h2>
        <p>
          <div className="hidden float-right pb-4 pl-4 bg-white md:block">
            <div className="w-60">
              <Image src="/assets/paypal.svg" width={372} height={99} layout="intrinsic" />
            </div>
          </div>
          If you would like to send a small donation via PayPal, you can send any donation to help cover expenses to my
          PayPal email address: <b>erv@ewal.net</b>
        </p>
        <div className="text-sm">
          <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
            <input type="hidden" name="cmd" value="_s-xclick" />
            <input type="hidden" name="hosted_button_id" value="HGE3CRYBFTU9Y" />
            <table>
              <tr>
                <td>
                  <select name="os0" className="w-48 text-sm border-gray-300 rounded">
                    <option value="$5">Give $5 USD</option>
                    <option value="$10">Give $10 USD</option>
                    <option value="$20">Give $20 USD</option>
                  </select>
                </td>
              </tr>
            </table>
            <input type="hidden" name="currency_code" value="USD" />
            <input
              type="image"
              className="mt-4 w-auto"
              src="https://www.paypalobjects.com/en_US/i/btn/btn_paynow_LG.gif"
              name="submit"
              alt="PayPal - The safer, easier way to pay online!"
            />
            <img alt="" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1" />
          </form>
        </div>
      </div>
    </div>
  );
};

Donate.title = "Donate";

export default Donate;
