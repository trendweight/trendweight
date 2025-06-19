import { createFileRoute, Link } from '@tanstack/react-router'
import { Layout } from '../components/Layout'

export const Route = createFileRoute('/tipjar')({
  component: TipJarPage,
})

function TipJarPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">Want to help support TrendWeight?</h1>
        
        <p className="text-lg leading-relaxed text-gray-700">
          TrendWeight is a free app. I created it in my free time because I like tech gadgets and I wanted a better way to apply the concepts of the Hacker's
          Diet to my own day-to-day life. I didn't create it in order to make money. However, from time to time, I get an email from someone asking if there is
          some way they can make a donation to help support TrendWeight.
        </p>
        
        <p className="text-lg leading-relaxed text-gray-700">
          Since TrendWeight is a development project I work on in my free time, I don't have to pay employees to develop or maintain the site. But there are
          some small fees I pay each month for the servers and software that power TrendWeight. In the interest of transparency, let me tell you what those
          costs are.
        </p>
        
        <p className="text-lg leading-relaxed text-gray-700">
          In fact, <a href="https://trendweight.io" className="text-brand-600 hover:text-brand-700 underline">trendweight.io</a> pretty inexpensive to run:
        </p>
        
        <ul className="pl-8 list-disc space-y-2 text-lg text-gray-700">
          <li>
            The website runs on <a href="https://vercel.com" className="text-brand-600 hover:text-brand-700 underline">Vercel</a>: <b>$20</b>
            /month
          </li>
          <li>
            Performance monitoring is <a href="https://vercel.com/docs/analytics" className="text-brand-600 hover:text-brand-700 underline">Vercel Analytics</a>: <b>$10</b>
            /month
          </li>
          <li>
            The database and authentication is on <a href="https://firebase.google.com/pricing" className="text-brand-600 hover:text-brand-700 underline">Firebase</a>: <b>$0</b>/month
          </li>
        </ul>
        
        <p className="text-lg leading-relaxed text-gray-700">
          In total, my monthly expenses are <b>$30</b>/month.
        </p>
        
        <p className="text-lg leading-relaxed text-gray-700">
          Let me be <b>crystal clear</b>: I don't need help paying for TrendWeight. I can afford to run TrendWeight out of my own pocket. I only have this page
          because people kept emailing me asking how to support the site. If you really want to help, there are a few ways I can suggest...
        </p>
        
        <hr className="my-8 border-gray-300" />
        
        <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">Tip with Ko-fi</h2>
        
        <p className="text-lg leading-relaxed text-gray-700 mb-6">Ko-fi lets you give a small amount to someone using a credit card, PayPal, or Apple Pay.</p>
        
        <div 
          dangerouslySetInnerHTML={{
            __html: `
              <style>img.kofiimg{display: initial!important;vertical-align:middle;height:13px!important;width:20px!important;padding-top:0!important;padding-bottom:0!important;border:none;margin-top:0;margin-right:5px!important;margin-left:0!important;margin-bottom:3px!important;content:url('https://storage.ko-fi.com/cdn/cup-border.png')}.kofiimg:after{vertical-align:middle;height:25px;padding-top:0;padding-bottom:0;border:none;margin-top:0;margin-right:6px;margin-left:0;margin-bottom:4px!important;content:url('https://storage.ko-fi.com/cdn/whitelogo.svg')}.btn-container{display:inline-block!important;white-space:nowrap;min-width:160px}span.kofitext{color:#fff !important;letter-spacing: -0.15px!important;text-wrap:none;vertical-align:middle;line-height:33px !important;padding:0;text-align:center;text-decoration:none!important; text-shadow: 0 1px 1px rgba(34, 34, 34, 0.05);}.kofitext a{color:#fff !important;text-decoration:none:important;}.kofitext a:hover{color:#fff !important;text-decoration:none}a.kofi-button{box-shadow: 1px 1px 0px rgba(0, 0, 0, 0.2);line-height:36px!important;min-width:150px;display:inline-block!important;background-color:#29abe0;padding:2px 12px !important;text-align:center !important;border-radius:7px;color:#fff;cursor:pointer;overflow-wrap:break-word;vertical-align:middle;border:0 none #fff !important;font-family:'Quicksand',Helvetica,Century Gothic,sans-serif !important;text-decoration:none;text-shadow:none;font-weight:700!important;font-size:14px !important}a.kofi-button:visited{color:#fff !important;text-decoration:none !important}a.kofi-button:hover{opacity:.85;color:#f5f5f5 !important;text-decoration:none !important}a.kofi-button:active{color:#f5f5f5 !important;text-decoration:none !important}.kofitext img.kofiimg {height:15px!important;width:22px!important;display: initial;animation: kofi-wiggle 3s infinite;}@keyframes kofi-wiggle{0%{transform:rotate(0) scale(1)}60%{transform:rotate(0) scale(1)}75%{transform:rotate(0) scale(1.12)}80%{transform:rotate(0) scale(1.1)}84%{transform:rotate(-10deg) scale(1.1)}88%{transform:rotate(10deg) scale(1.1)}92%{transform:rotate(-10deg) scale(1.1)}96%{transform:rotate(10deg) scale(1.1)}100%{transform:rotate(0) scale(1)}}</style><link href="https://fonts.googleapis.com/css?family=Quicksand:400,700" rel="stylesheet" type="text/css"><div class="btn-container"><a title="Support me on ko-fi.com" class="kofi-button" style="background-color:#29abe0;" href="https://ko-fi.com/ervwalter" target="_blank"> <span class="kofitext"><img src="https://storage.ko-fi.com/cdn/cup-border.png" alt="Ko-fi donations" class="kofiimg">Buy me a Coffee</span></a></div>          
            `,
          }}
        />
        
        <hr className="my-8 border-gray-300" />
        
        <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">Venmo / PayPal</h2>
        
        <p className="text-lg leading-relaxed text-gray-700 mb-6">If you like, you can also send small amounts directly via PayPal or Venmo:</p>
        
        <ul className="pl-8 list-disc space-y-2 text-lg text-gray-700">
          <li>
            Venmo: <a href="https://venmo.com/code?user_id=2181966380138496050" className="text-brand-600 hover:text-brand-700 underline">ErvWalter</a>
          </li>
          <li>
            PayPal: <a href="https://paypal.me/erv" className="text-brand-600 hover:text-brand-700 underline">erv@ewal.net</a>
          </li>
        </ul>
      </div>
    </Layout>
  )
}