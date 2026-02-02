'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Printer } from 'lucide-react'

interface AccordionItem {
  title: string
  content: React.ReactNode
}

const guideContent: AccordionItem[] = [
  {
    title: 'Introduction',
    content: (
      <div className="space-y-4">
        <p>I wrote this guide to make older electromechanical and solid-state games more fun for people to play by making them more understandable. If you know the goals on a game and the means and techniques to achieve them, any pinball machine becomes more fun.</p>
        <p>I have omitted numerous machines, especially earlier EMs, due to their infrequent appearance at tournaments, shows or on location. Other machines have been omitted because they are &ldquo;luck boxes&rdquo; where you just flip the ball into the bumpers and pray for lots of action before the ball comes back down. If you come across a game that you think should be included here, though, let me know and I&rsquo;ll consider it.</p>
        <p>This guide, while comprehensive, is not perfect. I&rsquo;ve done my best to make it accurate, but as I mention in the instruction card section, the individual game unit you happen to be playing may not perform exactly as described here. I may have missed something or misremembered it; owners, operators and tournament directors can and do make alterations to games for various reasons; 40-, 50- or 60-year-old machines can develop bugs and not function as built. Treat this document as a guide, not an absolute. Remember that what the machine really does is the final say on your score.</p>
        <p>In response to requests for a &ldquo;condensed&rdquo; version of the guide, I have a &ldquo;Quickie Version&rdquo; at the beginning of the section for each game. I&rsquo;ve kept all of the details in for those interested in the more in-depth analyses.</p>
        <p>I&rsquo;m interested in how well this guide works for people who use it. If you find something you&rsquo;d care to add or correct, pass it along to me. While I&rsquo;ve played all of these games, in some cases it has been many years since I last did so. I&rsquo;ve omitted some details when I couldn&rsquo;t remember them with certainty, e.g. whether the bonus maxes out at 19,000 vs. 15,000 in a few cases. If you see one and have the correct information, let me know and I&rsquo;ll update it. Thanks.</p>
      </div>
    ),
  },
  {
    title: 'Overview - Electro-Mechanical "EM" Games',
    content: (
      <div className="space-y-4">
        <p>I begin this guide with games produced in the late 1960&apos;s, when pinball had evolved enough to have skill play a major role. (If you want to know about earlier games, there are plenty of pinball history books.) At this stage, the games were all &ldquo;Electro-Mechanical&rdquo; amusement devices. These &ldquo;EM&rdquo;s, for short, were made up until early 1978. About 90% of the ones you&apos;ll see on location or at pinball tournaments or shows were made by either Gottlieb, Williams or Bally. Most of those which are &ldquo;competition suitable&rdquo; in terms of design, maintainability and &ldquo;skill&rdquo; date from 1965 and later, skewing towards the latter years. All have mechanical scoring reels which rotate vertically to advance in value. Some have an indicator light to show when a player has &ldquo;rolled over&rdquo; the score, typically at a value of 100,000, but most have no indication when a player rolls the game a second time. Most EM games have manual coil plungers, but a few older ones automatically plunge the ball when you hit one of the flippers, usually the right one, similar to the autoplunger buttons on newer games like Attack from Mars. Older games may also have a push-up trough where the player must first push a lever on the right side of the machine cabinet to raise a ball into the plunger lane prior to pulling the plunger to serve the ball. These machines will either show the balls yet to be plunged through a glass window in the lower front of the top of the game surface or, if one ball is continually recycled, indicate the ball count at the lower left just below the glass surface.</p>
      </div>
    ),
  },
  {
    title: 'Overview - Solid-State "SS" Games',
    content: (
      <div className="space-y-4">
        <p>In the late 1970&rsquo;s, manufacturers changed how scores are displayed on pinball machines, abandoning the use of rotating mechanical reels and replacing them with brand new digital displays using solid state electronics (hence the vintage&rsquo;s name, Solid State). The advent of such electronics and other advances enabled manufacturers to incorporate new playfield and scoring features into the games. The use of multiple levels of bonus multipliers became easier to implement and more common in use. Drop targets were used in new ways - in line rather than always side-to-side; targets that popped back up when not hit in the correct sequence; drop targets with stand-up targets hidden behind them. Multiball play became more common, though still not pervasive as it is today. Sound effects became more varied, and speech was added. Mechanical push-ups of balls into the plunger lanes were gone.</p>
        <p>Despite all that, the general strategies remained similar on many games to that of the EM era: shooting the ball &ldquo;up top all day&rdquo; a.k.a. UTAD to have it bounce around and hit many scoring features; completing sets of drop targets; going for lit spinners; building and collecting bonus. All of these continued to be high-value choices.</p>
        <p>Many solid-state games emphasize &ldquo;bonus and multiplier&rdquo; strategies. The multiplier usually maxes out at 5X or 6X. Some have a &ldquo;superbonus&rdquo; feature where once a certain bonus level is reached, that amount of base bonus is preserved for the remainder of the game. Some games may instead preserve your achieved multiplier. A few games preserve both.</p>
      </div>
    ),
  },
  {
    title: 'Overview - General',
    content: (
      <div className="space-y-4">
        <p>Almost all of the machines mentioned here lack &ldquo;tilt warnings.&rdquo; Modern games make a buzzing or other sound when shaken to alert you that you are about to tilt the game. This gives you an opportunity to stop shaking and possibly avoid tilting if the shake triggering the warning was not too severe. These older games are more binary: the game tilts with no warning to the player. Furthermore, on the older EMs, a tilt may end the game even if you are not on your last ball. If &ldquo;tilt ends game&rdquo; is active, either the machine will have text mentioning that on its instruction card or the competition director should have placed a sign on the machine to so notify the players.</p>
        <p>I will be using a fair amount of &ldquo;pinballese&rdquo; here, e.g. terms like shatzing or alley passing (defined below), and abbreviations like SDTM (Straight Down The Middle, as in that&rsquo;s where the ball may go in the situation at hand, ending play of that ball or the game) and UTAD (Up Top All Day, meaning that the best strategy to use at that point in your game is to flip the ball up to the top of the machine and ignore lower features and targets). I also am omitting photos both to save space and because I do not possess photos of many of the games I&rsquo;ve included. For both a good pinball glossary and useful photos of most machines, I recommend using the Internet Pinball Database [ipdb.org]. I will include explanations of a few terms here when I think they may not be in ipdb or if I use them somewhat differently.</p>
      </div>
    ),
  },
  {
    title: 'Preview and Basic Principles',
    content: (
      <div className="space-y-4">
        <ol className="list-decimal list-inside space-y-3">
          <li>When in doubt, UTAD - - Up Top All Day. Shoot the ball up towards the top of the machine, through a spinner or over some other kind of high-value switch if possible, and better yet if that spinner or switch has been raised to its maximum value. Take whatever path to the top is the safest and or easiest to shoot if there are no significant value differences among paths.</li>
          <li>Nudging: as mentioned above, most older games have NO tilt warnings. You find out you shook it too hard when your ball, or the entire game, suddenly ends. Nudge, but don&rsquo;t vigorously shake. Those &ldquo;slide the game sideways&rdquo; moves you can make on many modern Stern machines won&rsquo;t work here, you&rsquo;ll tilt. One-time bumps on the side or front of the game should suffice. On many games, a large fraction of your final score will come from end-of-ball bonuses. For these, avoiding tilting is more important than you&rsquo;re probably used to. Where there is no end of ball bonus, desperation shoves are worth a try if it&rsquo;s your last ball, or if the penalty is only the end of the ball currently in play (some games take the ball in play plus a second ball as a tilt penalty)</li>
          <li>If there&rsquo;s a &ldquo;collect bonus&rdquo; shot and your bonus is close to maximum, shoot it. There are some exceptions, but I&rsquo;ll cover these game by game.</li>
          <li>If there&rsquo;s a &ldquo;light double bonus&rdquo; shot lit, shoot it</li>
          <li>Completing sets of things (targets of a given color or suit, lanes, saucers, etc.) is generally better than a random mix of each item.</li>
          <li>On some machines, there is a way to &ldquo;close&rdquo; or &ldquo;zip&rdquo; the flippers so they are closer together and the ball cannot fall through between them. If there&rsquo;s a shot to do this, you should usually shoot it. Similarly, if there&rsquo;s an &ldquo;up post&rdquo; shot to raise a center post between the flippers, make that if you can. Once you have the flippers closed (&ldquo;zipped&rdquo;) or the post up, it&rsquo;s usually good to let the ball drop onto them, then take your time setting up your next shot.</li>
          <li>If there&rsquo;s a shot or a nudge that returns the ball to the plunger lane, do so!</li>
          <li>When shooting for bumpers, whether normal or &ldquo;mushroom&rdquo; bumpers, try to make the hits grazing ones where the ball will continue upwards after hitting the bumper. (See El Toro, Fireball, Cosmos, etc.) A direct hit on the bottom of a bumper may cause the ball to be kicked out the center or side drain by the bumper.</li>
        </ol>
      </div>
    ),
  },
  {
    title: 'Go-To Flipper',
    content: (
      <div className="space-y-4">
        <p>On many machines, there&rsquo;s an imbalance as to which flipper you&rsquo;ll want to use most often. Either the more important shots face one flipper, more shots overall are made from one flipper, or the shots are easier or safer with one flipper than the other. For any such game, use the ball control skills below to get the ball to the desired flipper. If you could flip the ball with the less desirable flipper but could also tip or dead bounce the ball to the more useful flipper, don&rsquo;t flip! Dead bounce, tip, or otherwise transfer the ball instead. You don&rsquo;t have to swing at every pitch here; just keep the ball in play and work to tee it up for a precise shot at what&rsquo;s most valuable at the time.</p>
        <p>For each game in this guide, I have listed what I consider to be the &ldquo;go-to&rdquo; flipper. &ldquo;Right,&rdquo; &ldquo;Left,&rdquo; and &ldquo;Balanced&rdquo; are self-explanatory. For some games, I list it as &ldquo;mild bias Right&rdquo; or Left. This generally means that it&rsquo;s not worth special effort to try to get the ball on one flipper vs. the other, nor to transfer a ball cradled on one flipper to the other one. Its meaning is more that when the ball is moving such that you can easily get it to either one, choose the mild bias flipper.</p>
        <p>In other cases, which flipper should dominate changes during the course of game play, e.g. Right flipper early on and Left flipper after certain goals are achieved. These are noted as such, often specifying the goal(s) that trigger the switch.</p>
        <p>Occasionally, you should try to transfer the ball to the &ldquo;go-to&rdquo; flipper even if you already have it safely cradled on the other flipper. Most of the time, I&rsquo;ve indicated this in the text, but since I added this item well after building out the guide, many of the earlier entries might not explicitly say this. You&rsquo;ll need to interpret my intent. These older Classics games are less suitable for many types of flipper-to-flipper transfers, though; post passes and alley passes might not be possible due to the machine&rsquo;s design.</p>
      </div>
    ),
  },
  {
    title: 'Ball Control',
    content: (
      <div className="space-y-4">
        <p>Use &ldquo;dead bounces&rdquo; to pass the ball across to the other flipper and get to a cradle. A dead bounce is when you let a ball falling towards a flipper hit it without flipping so that the ball bounces off of it and across to the other side, where it will often roll up just past the other flipper. You can then raise the other flipper and get the ball to settle down onto that flipper to take a more controlled shot. Most older games have relatively dead flipper rubber so that such bounces are unlikely to go up into the slingshots and out of control as is sometimes the case on modern games. But be careful - if the rubber is too dead, the ball may just die down the center.</p>
        <p>When you have the ball cradled on a flipper, you often can&rsquo;t transfer it to the other flipper using a post pass as you would on more recent machines. There may be no posts, or they may be too high up, or too close, or the flippers unsuited for making that move. Your two basic alternatives are tap passing (soft late flip) and alley passing a.k.a. shatzing (an end-of-the-flipper shot into the opposite flipper lane). Bally games are more likely to accommodate tap passes due to the flipper construction. Williams games more often can apply shatzing. Gottlieb games&rsquo; flippers generally don&rsquo;t tap pass well, and results are mixed on alley passing. Mini flippers (2 inches long versus standard 3 inches) on any model don&rsquo;t tap pass as well as full-size ones, but you may be able to alley pass or use micro-flips as described below.</p>
        <p>Drop catching, live catching and especially dead bounces will be very useful but beware the &ldquo;dead catch&rdquo; or &ldquo;death bounce.&rdquo; Sometimes the flipper response will be so slow after a catch that the ball will roll off the end of it before you can flip. Or the flipper rubber will be so dead that the bounce off of it won&rsquo;t make it across to the opposite flipper, just die down the center. Watch and learn from the player ahead of you if you can.</p>
        <p>Micro-flipping. On several games, the ball can come to rest between either the tips of the two flippers, when in a &ldquo;closed flippers&rdquo; position, or between a flipper and a center post. When you have a chance to let the ball do this, take it unless it&rsquo;s easier to get the ball directly to a flipper cradle. Once the ball is there, use tiny flips to nudge it to a spot where you can either cradle it on the opposite flipper (Time Zone), or take a shot as it rolls up the other flipper if that&rsquo;s more advantageous (Fireball). This is one skill or feature that&rsquo;s absent from modern games.</p>
      </div>
    ),
  },
  {
    title: 'Playing Style - Control vs. Flow',
    content: (
      <div className="space-y-4">
        <p>On most pinball machines you should try to get control of the ball, cradle it on a flipper, then make a precise shot at a specific objective. Not all games are best played that way, though, and it&rsquo;s good to know when to change techniques. Some games are best played with a &ldquo;flow&rdquo; style, where you flip the ball almost immediately after it touches a flipper. There are some simple ways to tell when this may occur. The clearest cases are when there&rsquo;s little or no chance to cradle the ball in the first place. This can occur when there&rsquo;s a gap behind the flipper elbows, e.g. Doodle Bug, when the flippers are angled so low you can&rsquo;t readily get the ball to sit on them, e.g. Scuba, and when the game has the short 2&rdquo; flippers with little room above them for the ball to settle down.</p>
        <p>There are also games where you can play control style but often shouldn&rsquo;t depending on the ball&rsquo;s motion. These occur when there&rsquo;s a risk of the ball rolling up the flipper and out of play behind it on games like Grand Prix (both flippers) and Trident (right flipper). There are also times when you should use &ldquo;flow&rdquo; style to provide extra energy to your shots. Trident&rsquo;s left flipper is one case of this, where the ball enters a chute above it and comes racing down towards it, providing you a chance to shoot the spinner. Flipping at the moving ball increases the speed of the shot, giving you a chance to earn more spinner points.</p>
        <p>There are games where flow style helps you make shots you otherwise can&rsquo;t. This often happens on very old games with weaker flippers, more often the 2&rdquo; size than the 3&rdquo; size. Just as in baseball a swing at a pitched ball will make the ball fly further than just tossing it in the air and hitting it, flipping at a ball coming at the flipper will provide both flipper power energy and rebound off the flipper rubber energy, enabling you to get the ball higher up onto the playfield than you could from a cradled shot. On games where UTAD (up top all day) is key more so than making specific shots, this can be very important.</p>
        <p>Lastly, there are special cases where you need to play &ldquo;flipper defense&rdquo;. On Spanish Eyes, for example, balls bouncing off the bottom center bumper can be propelled past the flippers into either side outlane if you don&rsquo;t take a swat at them as they go by.</p>
      </div>
    ),
  },
  {
    title: 'Shot Selection and Aiming',
    content: (
      <div className="space-y-4">
        <p>Ever watch golf on TV? If so, you&rsquo;ve probably heard an announcer talk about the &ldquo;correct miss.&rdquo; This refers to when you take a shot that may not go exactly where you want it to: what happens when you miss your target by a modest but not severe amount? If you&rsquo;re nowhere close to target, e.g. 50+ feet off in golf, you may be in a lot of trouble, but that&rsquo;s due to missing that badly, and you&rsquo;ll pay the price. But when you miss by 10-20 feet, i.e. you&rsquo;re reasonably close, can anything bad happen? If the hole is near the edge of the green and there&rsquo;s a sand trap next to that edge, you&rsquo;ll see pro golfers target a spot between the hole and the center of the green, rather than the hole itself, so that if they miss, they&rsquo;re not in the sand trap.</p>
        <p>Pinball has similar situations. For instance, when shooting the ball up a side orbit to the top of the game, if you miss high, the ball may hit a post and rebound dangerously, while if you miss low, the ball may hit the side of the machine and go partway but not all the way up to the top. The basic strategy is that while trying to hit your exact target, time your shot to favor missing to the &ldquo;safe&rdquo; side. The better your aim is, the closer to dead center you should. (Exceptions are when you get a better rebound by hitting the edge of something.) The worse or less consistent your aim is, the more you need to consider which way to miss - right or left with bottom flippers, high or low with upper flippers. If one way is safer than the other, aim a shade to the safe side of center.</p>
        <p>If you&rsquo;re shooting at a bank of targets, all of equal value, start nearer the middle if your aim is so-so; that way if you miss the center one, you&rsquo;ll likely still hit a target to the side of the center one. If your aim is better and some targets are &ldquo;easier&rdquo; to hit than others for whatever reason, try to start with the harder ones. Usually the hardest targets are the highest one, when weak flippers strain to make it up there and only a perfect shot will do, or the lowest one, where a post or other feature may block the lower edge of the target (e.g. #4 on Centaur).</p>
        <p><strong>Flipper Choice.</strong> Many shots can be hit with either flipper. There is usually a &ldquo;better&rdquo; flipper to choose for the shot, and it may not be the obvious choice. Novice players generally don&rsquo;t use &ldquo;backhand&rdquo; shots, and even middle-tier players don&rsquo;t use them as often as they should. When there is a choice, consider these things:</p>
        <ol className="list-decimal list-inside space-y-2 ml-4">
          <li>How easy to hit is the shot from each flipper?</li>
          <li>Where does the rebound go from each?</li>
          <li>Can I safely transfer the ball from one flipper to the other before choosing which flipper to use</li>
          <li>Is it better to shoot with the ball stopped on the flipper in a cradle position or with the ball moving down (or up) the flipper? A moving ball has more energy and is often necessary to hit some shots.</li>
        </ol>
        <p>Speaking of moving balls having more energy, there&rsquo;s a technique that&rsquo;s much more useful on EMs than on many recent machines, which I as a &ldquo;flow&rdquo; player use frequently. I call it a &ldquo;flying backhand.&rdquo; This is when the ball is moving towards a flipper from the opposite side of the playfield and rather than try for a cradle, dead bounce, or normal forward flip, I wait until the ball is near the flipper surface and then try to flip it up and backwards. This can improve my chances for some shots, not so much when shooting at specific targets as when trying to go UTAD or to get the ball into a narrow chute. Another reason to use the flying backhand is sheer physics: the ball will have more energy and go higher up or hit harder than a shot from a cradle.</p>
        <p>One example is RoGo. When shooting up top, forehand shots to the opposite side of the playfield must negotiate a sharp angle. A ball going up top from the same side as the flipper is on has a much more open entry to the gap. The catch is, you either can&rsquo;t flip the ball up that way from a cradled position on the flipper at all or else if you tried, it wouldn&rsquo;t go up as far as needed because the ball is standing still to start and flipper power is limited. Spanish Eyes and Liberty Belle are a few other games where the flying backhand is useful.</p>
        <p>On modern games, the flying backhand tends to be less useful, since it&rsquo;s often hard to hit a ramp shot that way, and orbit shots tend to be aligned to be more makeable from the normal opposite-side flipper.</p>
      </div>
    ),
  },
  {
    title: 'Plunging',
    content: (
      <div className="space-y-4">
        <p>Skillful ball plunging is more important on EMs than on later games, although it&rsquo;s coming back into vogue on some new games. In many cases, you need to get the ball into each of several different lanes at the top of the game for maximum scoring, and it is often difficult if not impossible to get the ball back through a top lane from below during play.</p>
        <ol className="list-decimal list-inside space-y-3">
          <li>Use the markers in the plunger lane to change or repeat a plunge to a specific goal. It&rsquo;s a good idea to use practice time to find out which marker plunges to which lane or other location at the top of a machine.</li>
          <li>Know when to &ldquo;short plunge&rdquo; or &ldquo;soft plunge,&rdquo; i.e. plunge just barely enough to put the ball into play. This is often to get the ball to land in the right-hand-most lane or feature at the top of the machine. It&rsquo;s useful on many EMs, like Flip-A-Card and Solid States, like Eight Ball.</li>
          <li>Learn to &ldquo;thumb plunge.&rdquo; At times, the ideal plunge is a maximum force plunge. While you can achieve this by banging the plunger with your fist, it&rsquo;s safer for both your hand and the machine to use a different technique. Pull the plunger ball all the way with your left hand while placing your right thumb on the plunger&rsquo;s outer face and your right fingers on the game&rsquo;s top above the plunger lane. Simultaneously let go of the plunger with your left hand and push in with your right thumb. The result will be a ball that rockets into play. It can be a more accurately repeated plunge than even using the markers at times, so if it goes where you want it, use it.</li>
          <li>Know your plunging goals. Besides getting the ball to land in a particular lane or saucer, it may be optimal to have it hit something else along the way first, e.g. also hit some rollovers above the lanes, or hit some upper rubbered switches to change which top lane is lit or change the value of a top saucer before the ball lands in either.</li>
        </ol>
      </div>
    ),
  },
  {
    title: 'Common Playfield Features',
    content: (
      <div className="space-y-4">
        <p>EMs and Solid States have fewer types of playfield features than later games; technology takes time. Here are the features you&rsquo;ll find most often:</p>

        <h4 className="font-bold text-[var(--dark-green)] mt-6">Lane Sets</h4>
        <p>Often used to advance the Bonus Multiplier [or light a lane to do so], or to increase the value of drop targets or other playfield features. On some games, scoring a top lane will light a corresponding lower lane below for increased scoring. If so, there may be a top lane you should try to score first since the lane below which it lights is more likely to be scored later than the others. Example: the center lane on Royal Guard.</p>

        <h4 className="font-bold text-[var(--dark-green)] mt-6">Drop Target Sets</h4>
        <p>On most EMs, there is no scoring advantage to hitting targets in any particular order. [Sample exception: Sinbad] That doesn&rsquo;t mean there&rsquo;s not a best order to hit them in, however! Some targets are more dangerous than others due to where the rebounds tend to go. We&rsquo;ll deal with that by machine if needed. Otherwise, watch your rebounds and learn what&rsquo;s riskiest on your particular game. Avoid those targets if feasible, otherwise get them last.</p>
        <p>On SS games, there may be a preferred target order, usually left-to-right or vice versa. There may also be one set of targets that is more valuable than the other(s), either all of the time or during specific times. For instance, on Joker Poker, each set of drops of a given card type [10-J-Q-K-A], lights your 5X bonus on a different ball in play.</p>
        <p>Drop Target values may vary depending on what you&rsquo;ve done before you hit them. Games where this is critical include:</p>
        <p>Volley -- targets are worth 500 without the matching colored lane, 5000 with matching lane</p>
        <p>Jacks Open -- targets are worth 1000 plus 1000 per completed lane up to 3 lanes; completing the 4th lane resets the lanes and target values</p>
        <p>Card Whiz -- targets are worth 1000 plus 1000 per completed lane up to 3</p>
        <p>Jumping Jack - targets are worth 100 in bonus, 1000 if lit saucer collected</p>
        <p>Several games have drop target-based end-of-ball bonuses. In some cases, complete sets matter [High Hand - 10 times the value for complete suits]. In other cases, they don&rsquo;t [El Dorado].</p>

        <h4 className="font-bold text-[var(--dark-green)] mt-6">Inline Drop Targets</h4>
        <p>On several solid-state games, notably Ballys, a series of 3 or 4 drop targets are positioned in a mostly vertical row one behind the other. They are most often used to increase your bonus multiplier, e.g. on Paragon, the first two targets are just points, then the next two give you 2X and 3X bonus, and finally the saucer behind the targets gives you 5X bonus. Some sets are 2-3-5, some are 2-4-6, some are 2-3-4-5, some like Paragon have one or two non-multiplier targets first. In each case, though, they are a primary goal for you on those machines. For some of these games, the path behind the targets is open, leading to the top of the machine; this is usually also a good thing to shoot for. In other cases, there&rsquo;s a dead-end behind them, with a standup target of some kind set there; these are usually valuable, too. Other example games include Eight Ball Deluxe, Future Spa, Dolly Parton, Black Pyramid, Viking, Frontier, Harlem Globetrotters, Flash Gordon and Hotdoggin.</p>

        <h4 className="font-bold text-[var(--dark-green)] mt-6">Vertical Spinners</h4>
        <p>Flaps hung above the playfield that spin when the ball travels through them. When spinners are single-valued, they are usually not worth shooting. Most spinners, though, are dual-valued, e.g. 100 per spin unlit, 1000 when lit or 1K unlit and 10K lit. A few machines even have 3 or 4 spinner value levels. Somewhere on the game surface or instruction card will be text telling you how to light the spinners for their higher value(s). On some games, the spinners when lit are highly valuable compared to other features and are &ldquo;safe&rdquo; shots in that the ball goes up to the top of the game through them vs. a shot at a drop target where the rebound can drain. On these games, the optimal strategy often becomes &ldquo;light spinner(s), then shoot spinners all day.&rdquo; Grand Prix is one of the best-known examples of this.</p>
        <p>Be aware that not all spinners are created equal: some spin many more times per hit than others, i.e. they&rsquo;re &ldquo;juicy.&rdquo; The juicier a spinner is, the more valuable shooting it becomes as a strategy. Spinners which just flip a few times before they stop may not be worth your effort, and an alternate strategy should be chosen.</p>

        <h4 className="font-bold text-[var(--dark-green)] mt-6">Horizontal Spinners</h4>
        <p>Disks set into the surface of the playfield that spin when you hit either of two posts on their edges positioned 180 degrees apart. They are usually used to build bonus of some kind, and can rotate either clockwise or counterclockwise, depending on how and where you hit them. While most vertical flap spinners are designed to be spun almost exclusively by shots from the flippers, horizontal spinners can also be spun when the ball bounces into them off slingshots, bumpers or other playfield features. Such bounces can also cause them to stop spinning or even reverse direction if they are spinning when hit a second time.</p>
        <p>When shooting at horizontal spinners, you need to consider three factors for your shots: the angle of the line between the posts relative to the flipper; which direction you want the spinner to spin; and where the rebound from the shot might go. If the line between the spinner posts is roughly perpendicular to the flipper you have the ball on, you&rsquo;ll get more spins from your shot. You make the spinner rotate clockwise with a shot to the left post and counterclockwise with a shot to the right post. If the posts are nearly aligned with you, a shot may just kick right back at the flippers without causing the disk to spin much, if any, and risks a center drain. Don&rsquo;t shoot at the spinner when it&rsquo;s at such an angle; shoot the ball elsewhere and wait for a random bounce to realign the spinner for you.</p>
        <p>Since shots directly at the center of a post regardless of angle may bounce downwards, and possibly drain, you usually want to hit the post slightly off center. Consider both &ldquo;slightly off center&rdquo; and &ldquo;just grazing&rdquo; shots, taking into account where the rebound from your intended shot is likely to go. If there&rsquo;s a bumper just beside and behind the post, for instance, you may want to hit the post so that the rebound will avoid the bumper.</p>

        <h4 className="font-bold text-[var(--dark-green)] mt-6">Rollover Buttons</h4>
        <p>Less common, these can be asterisk-shaped disks with slightly raised centers [Jungle King], lozenge-shaped disks about ½ inch wide [Satin Doll], or small tabs ¼&rdquo; wide [Hang Glider]. They often advance your bonus or spot a number / card / letter. On machines which have a large number of these, it&rsquo;s usually a good strategy to hit as many of them as possible. Where there are fewer such buttons, they can often be ignored.</p>

        <h4 className="font-bold text-[var(--dark-green)] mt-6">Bumpers</h4>
        <p>Unlike most modern games, on EMs, the scoring from bumpers can sometimes be a significant fraction of your game&rsquo;s total. Lighting bumpers to increase their value by a factor of 10 can be important. It&rsquo;s also not unusual to have some bumpers worth more than others in a game, e.g. some be 10 points when unlit and 100 lit, others 100 unlit and 1000 lit. Bumpers are rarely high in relative value on the later SS games.</p>

        <h4 className="font-bold text-[var(--dark-green)] mt-6">Saucers</h4>
        <p>These come in two basic physical types: sharp-edged ones just slightly larger than the pinball [High Hand, Snow Derby], and shallow bowl-shaped ones [Little Chief, Strato-Flite]. Some just award points, although their value may change [Snow Derby again]. Others may cycle through different awards of either points, bonus advances, playfield features [open gate] or some combination thereof. Some may collect bonus. See what it does when you shoot it; it may be the most important shot on the game. The bowl-shaped ones are more likely to have the ball rim out and not fall in; watch out for that. The sharp-edged ones have a smaller feed-in area but are more likely to actually catch a ball once it&rsquo;s there.</p>

        <h4 className="font-bold text-[var(--dark-green)] mt-6">Ball Return Gates</h4>
        <p>A wire gate, usually at the lower right, where the ball will return to either the plunger lane or the flipper if the gate is open vs. draining out the side if the gate is closed. If the game has such a gate, you usually want to open it a.s.a.p.</p>

        <h4 className="font-bold text-[var(--dark-green)] mt-6">Waterfalls a.k.a. Plinko Lanes</h4>
        <p>Example games: 300, Atlantis, Centigrade 37 and Sing-Along. These are a series of lanes, usually two parallel sets on the right-hand side set one below the other, typically 3 or 4 pairs. There may be a gate below the bottom right lane that can be opened to return the ball to the plunger lane. The ball can drain out the [right] side if it comes down the outer lowermost lane and there is no open gate protecting it. They&rsquo;re usually valuable to shoot at, but their value must be weighted against the chance that the ball drains if it exits the lowest set of lanes the wrong way.</p>

        <h4 className="font-bold text-[var(--dark-green)] mt-6">Locked Ball Saucers and &ldquo;Lock Stealing&rdquo;</h4>
        <p>Some saucers are used to lock balls for multiball play. Locking a ball when the saucer is ready to do so is almost always a good thing to do. The ready state is sometimes indicated by the saucer being lit; on other games, it&rsquo;s always ready to lock a ball.</p>
        <p>Some machines that have lock ball saucers allow &ldquo;lock stealing.&rdquo; This occurs when one player shoots a ball into the lock but does not release it to start multiball before their turn ends. On many EM and SS games, that ball can be released by the next player, or by any other player after that, thereby giving them a multiball instead of the player who locked the ball. This alters the strategy of play when it occurs; for instance, if you begin your turn while there is a ball locked by a previous player, your best move is often to start that multiball right away. Whenever playing such a game, check the ball lock status before beginning your turn. Some examples are Fireball, Fathom, Space Shuttle, and Sorceror.</p>

        <h4 className="font-bold text-[var(--dark-green)] mt-6">Slingshots</h4>
        <p>Many EM games have relatively weak slingshots, mostly due to age; this still happens for solid state games, but far less often. In machines where there are no return lanes, e.g. the bottom configuration is outlane-left sling-left flipper-center gap-right flipper-right sling-right outlane, you&rsquo;ll often find the ball bouncing softly back and forth between the slingshots. Situations like this are where the &ldquo;art of nudging&rdquo; came to the forefront. Your goal in such situations is to nudge the machine (or not) when the ball hits the slings in order to get the ball to either settle gradually down to where it will be shootable with a flipper, or climb up and rise above the slings, but not go into either outlane. Examples: Drop-A-Card; Flip-A-Card; Fun Land</p>

        <h4 className="font-bold text-[var(--dark-green)] mt-6">Roto-Targets</h4>
        <p>These are spinning targets where a vertical or horizontal rotating disk has just a few of the targets on it exposed to the playfield surface at any time, the remainder being either underneath the playfield or blocked by posts or other objects at the edges of the area above the playfield. Shots can be made at any given time by hitting one of the exposed targets in the gaps. The disk is stationary when you are about to shoot at it - - it spins after the ball goes through an indicated lane or hits a target. You may also collect the item indicated in one of the gaps by having the ball go through a lane, hit a different target, land in a saucer elsewhere on the playfield, or drain in a linked outlane. Examples: Close Encounters; Spin-Out; Torch</p>

        <h4 className="font-bold text-[var(--dark-green)] mt-6">Vari-Targets</h4>
        <p>These are metal pads set in angled channels that you can push back via a flipper shot into the channel. The &ldquo;vari&rdquo; part comes from the fact that their value varies depending on how far back you push the pad - - further is more. The strength of the flippers, narrowness of the channel and stiffness of the target pad will all affect how easy it is to score on these. Examples: Baseball; Orbit; Pro Football</p>

        <h4 className="font-bold text-[var(--dark-green)] mt-6">Random Value Features [Spinners / Targets / Saucers]</h4>
        <p>Some game features award a random value when scored. Do the math. If the values are 5, 50 or 500, treat it as worth 185, i.e. use the average value. Then prioritize your shots using that average value vs. the fixed-value shots.</p>
        <p>Examples: Fun Land spinners; &ldquo;300&rdquo; and Soccer bonus-add saucers.</p>

        <h4 className="font-bold text-[var(--dark-green)] mt-6">Variable Award Lanes or Chutes or Switches</h4>
        <p>Examples: Sea Ray, Knockout, Heat Wave</p>
        <p>A few games have channels which can give you something or not, but which appear to be random as to when they are available. Most such games have a set of gears inside which simulate randomness; they actually do have a pattern, but their mechanics makes it a long enough one to not be worth trying to memorize, nor can you always tell where you&rsquo;re starting in the cycle. Sea Ray is a good example, where the wavy chute on the left can award up to 4 different things. The gearing, linked to the ten-point switches in this case, can light the chute for 0, 1, 2 or all 4 features. Each ten-point switch advances the cycle. A few steps actually do not change the chute status, but about 90% do. For games with this feature, if you want to collect or enable one or more awards via the chute, all you can do is keep shooting the ball towards the chute and hoping that you trigger just enough switch changes en route to light what you want as the ball enters it.</p>
        <p>Similarly, some games don&rsquo;t have simple on-off toggles for their bumpers, but a geared semi-random pattern. Heat Wave has its bumpers so wired. In this case, make the most of the top when lots of bumpers are lit.</p>
      </div>
    ),
  },
  {
    title: 'Bonus',
    content: (
      <div className="space-y-4">
        <p>Many EM and SS games are bonus-heavy, i.e. a large portion of your score will come from bonuses, usually collected at the end of a ball, sometimes coming from a collect bonus shot during the play of the ball, and sometimes both. You need to know several things about each game&rsquo;s bonus:</p>
        <ol className="list-decimal list-inside space-y-2 ml-4">
          <li>What shots add bonus?</li>
          <li>What is the maximum [base] bonus?</li>
          <li>Is there more than one bonus?</li>
          <li>If there&rsquo;s more than one bonus, can you make progress on all of them at once, or only one at a time?</li>
          <li>If only one at a time, what changes which bonus is active?</li>
          <li>Is bonus collected at the end of the ball?</li>
          <li>If collected at the end of the ball, are all bonuses collected or only the active bonus?</li>
          <li>Can you collect bonus before the end of the ball?</li>
          <li>What shots light collect bonus [if present]?</li>
          <li>What shots collect bonus?</li>
          <li>If you collect bonus before the end of the ball, does the bonus value reset to its starting amount or stay at the value collected?</li>
          <li>Can some or all of your bonus value be held to the next or to all future balls?</li>
          <li>What shots activate &ldquo;hold bonus&rdquo; [if present]?</li>
          <li>Are there one or more threshold bonus amounts which, if met, will hold a &ldquo;super bonus&rdquo; over to future balls?</li>
          <li>Is there a bonus multiplier?</li>
          <li>If there&rsquo;s a multiplier, how many levels?</li>
          <li>What shots increase the bonus multiplier?</li>
          <li>Is the bonus multiplier held to future balls?</li>
          <li>Does the bonus multiplier reset to 1 or to some less-than-maximum value on the ball after you raise it to its maximum value?</li>
        </ol>
        <p>Bonus values are usually shown on the playfield surface through lights corresponding to the value earned so far. In some cases, you&rsquo;ll need to add the value of two or more lights to get the total bonus, e.g. a game may have a bonus that maxes out at 29,000 and have a 20,000 light and a 9,000 light lit to indicate it; a 15,000 max indicated by a 10,000 light and a 5,000 light is another common combination. If you&rsquo;ve earned double [or triple, etc.] bonus, a separate light [usually colored] on the playfield will show that.</p>
        <p>If you look at final game scores relative to the maximum bonus that can be earned, you can get a good idea of how important building bonus on that game. For instance, on a 5-ball game where your maximum bonus is 15,000 and there&rsquo;s no multiplier, if the top scores are around 100K, bonus is probably the most important thing on that game.</p>
        <p>If a game has a &ldquo;collect bonus&rdquo; shot, it&rsquo;s usually worth trying to light it, if necessary, and shoot it once your bonus is near maximum value. On most machines, the bonus value will remain where it was after you make such a shot; on some games, the bonus value is reset to the minimum amount after you make the shot. I say &ldquo;usually&rdquo; above because the value reset situation creates a notable exception - - games where the bonus resets _and_ you have the ability to double or triple the end of ball bonus. These games include Cherry Bell, Mars Trek, Monaco and Super Straight [all Sonic/Segasa machines]; I&rsquo;ll deal with this situation in the individual discussions for those games.</p>
        <p>Some games have a &ldquo;hold bonus&rdquo; feature. Hold bonus means that whatever end of ball bonus you&rsquo;ve earned is carried over to the next ball in play; otherwise, bonus resets to zero or a base amount like 1000 after each ball. If a shot to activate hold bonus is available, it&rsquo;s usually good to take it as soon as you can.</p>
        <p>Solid State games may also have a &ldquo;super bonus&rdquo; feature, where if one has achieved a high level of base bonus, a large part of that base will be preserved for the remainder of the game. It&rsquo;s fairly common on Bally solid-state games in particular. It&rsquo;s an important goal to achieve when present.</p>
      </div>
    ),
  },
  {
    title: 'Add-A-Ball Game Considerations',
    content: (
      <div className="space-y-4">
        <p>Many older games are what&rsquo;s known as &ldquo;add-a-ball&rdquo; games, built for times and locations where winning a free game was prohibited. In some cases, they can be played much the same as their free-game siblings, but not always. For several machines here, your scoring strategy is impacted by the way add-a-balls work. This is most commonly seen on 1970&rsquo;s Gottlieb games; examples include Captain Card, Gold Strike, Target Pool and Free Fall. For games like these, one major objective is to complete a set of targets or lanes. Once completed, one or more targets or lanes on the playfield will light to award additional balls to play. This is different from the &ldquo;Same player shoots again&rdquo; extra ball, where at the end of the ball in play, it returns to the shooter lane with the ball counter unchanged, e.g. you&rsquo;re still on ball number 2. Add-a-balls increase the number of balls remaining to be played, up to a maximum of not just the 3 or 5 you started the game with but as many as 10 balls.</p>
        <p>When present, what typically happens when you enter add-a-ball mode is that you score zero points for whichever features award add-a-balls, getting additional balls to play instead. In a competition where add-a-balls are either turned off or forced to be plunged, this means you get little or no point value from them. In a few cases, this is a big deal; one striking example is Captain Card. On that game, the collect bonus features (the center saucer and the two outlanes) become the add-a-ball shots when you complete all 16 drop targets. They suddenly change from the most valuable things on the playfield to the least valuable point-wise. Gottlieb games typically have the add-a-ball activation features reset at the end of the ball during which they were completed, which at least lets you resume scoring progress. But the cost of completion can be high in lost scoring opportunity. You&rsquo;re better off not-quite-finishing the set in such cases.</p>
      </div>
    ),
  },
  {
    title: 'Game Condition',
    content: (
      <div className="space-y-4">
        <p>By definition, Classic games are now at least 35 years old, some over 50. Things wear out. Flippers, slingshots, bumpers, rubbers and other playfield parts don&rsquo;t last forever. There&rsquo;s a good chance that the machine won&rsquo;t play as it did when it was brand new.</p>
        <p>What things about a machine have changed with time and how will that affect how the game plays? Here are a few I see often:</p>

        <h4 className="font-bold text-[var(--dark-green)] mt-6">Weak flippers</h4>
        <p>This is the most common flaw - - flippers that have worn out. This can result in some shots being much harder to make, or more dangerous to take, than was intended when the game was built. Some of the shots you would normally take may be completely unhittable; others may be makeable, but only at much higher risk than as designed.</p>

        <h4 className="font-bold text-[var(--dark-green)] mt-6">Cratered lights</h4>
        <p>Many games have little circles in the lower center area of the playfield where, for instance, the amount of bonus you have earned thus far during your latest ball in play, or which letters of a set you&rsquo;ve collected so far, may be displayed. Over the years, these discs tend to sink into the wood surface of the playfield, creating moon-like craters in the otherwise flat playfield surface. When the ball rolls over these, it will deflect along the curve. Unfortunately, many of these discs are directly above the gap between the flippers, and the way they deflect the ball can cause it to drain down the center when it would normally have rolled towards a flipper without the cratering.</p>

        <h4 className="font-bold text-[var(--dark-green)] mt-6">Non-registering switches</h4>
        <p>Some playfield features may not register when the ball contacts them - - rollovers and targets may have reduced sensitivity and either not register at all or, more commonly, only register particularly strong hits to them.</p>

        <h4 className="font-bold text-[var(--dark-green)] mt-6">Wood wear</h4>
        <p>After 40 years, the wood on the outlane side walls has sometimes lost its bounce and the ball may not ricochet into the return lane as often as when the game was new. Another item is that a groove often forms at the top arc of the game, which can make hitting top saucers harder, e.g. on Wizard - - the ball will follow the groove and tend to drop down along the sides at the top rather than more uniformly along the entire top arc.</p>

        <h4 className="font-bold text-[var(--dark-green)] mt-6">Outlane pins and posts</h4>
        <p>On a few games there are thin pins that can deflect a ball that might drain back into play. As the machine ages, these may get bent such that they do not deflect the ball back as often, or at all in extreme cases.</p>

        <h4 className="font-bold text-[var(--dark-green)] mt-6">Weak or dead bumpers and slingshots</h4>
        <p>A worn-out old bumper or slingshot will not kick the ball as hard or as far as it was originally designed to. As a result, it may send the ball towards a drain or some other undesirable place. This is yet another thing to watch out for and try to avoid or nudge to mitigate. In some instances, a weak bumper or slingshot may actually work in your favor by either slowing the ball down to make it easier to control or directing it to a safer location than it normally would.</p>

        <h4 className="font-bold text-[var(--dark-green)] mt-6">Slippy Saucers</h4>
        <p>Games with saucers that the ball lands in get wear around the saucer edges. For the tight sharper-edged saucers, there&rsquo;s rarely a problem, but for the flatter open saucers it can be. The saucer edges get smoother from wear, making the ball more likely to slip out rather than fall into the saucer.</p>

        <h4 className="font-bold text-[var(--dark-green)] mt-6">Summary</h4>
        <p>What to do with such well-worn games? If the guidance given here isn&rsquo;t working, change tactics, technique or both, but keep in mind why I gave the guidance I did. If UTAD or the spinner or a certain drop target bank is where the points are, try to find an alternate way to get those points safely. If you can&rsquo;t do so safely, choose the next-most valuable objective to go for. Take what the machine gives you and make the most of it.</p>
      </div>
    ),
  },
  {
    title: 'Playfield Risk',
    content: (
      <div className="space-y-4">
        <p>I&rsquo;m replacing the &ldquo;Risk Index&rdquo; section with a game-by-game overview of where ball drains tend to come from. I generally do NOT include drains when you miss shots; miss and you&rsquo;re almost always at risk. Note that there will be cases where an individual example of a game differs from the general tendencies of the model. If you spot a tendency that you feel should be added or removed, let me know.</p>
        <p>For a large number of Classics machines, the #1 source of drains is simply the ball exiting the top of the game, frequently from a partially-shielded bumper area, and either draining directly or falling onto a slingshot and thereby going out of control (and then eventually draining before you can regain control). On other games, the bumpers are directly exposed and can smack the ball downwards to the middle or to an outlane. Side lanes can have exiting balls at some speeds simply arc down the center. Rebounds from most but not all targets can go out of control, though some present more rebound risk than others.</p>
        <p>Newer machines have very little of this; balls go to ramps, bumpers are usually secluded someplace where they can&rsquo;t smack the ball down the middle and it&rsquo;s rarer to have a lane or orbit where a ball can simply roll smoothly downward to a center drain; if there is, there&rsquo;s an upper flipper there to let you prevent it. That&rsquo;s why it&rsquo;s easier to have a really long game on a modern machine than a Classic.</p>
      </div>
    ),
  },
  {
    title: 'Machine Settings and Instruction Cards',
    content: (
      <div className="space-y-4">
        <p>Settings matter even on EMs - - while new games have far more selectable options, older games had some, even if you had to physically move a switch rather than push buttons and use menus. It can be important to note how your game is set. Some of these are obvious, for instance how many or which items of type A need to be scored to activate a change to how item type B scores.</p>
        <p>Each game should have an &ldquo;instruction card&rdquo; visible under the glass at the bottom of the game near the flipper buttons. EMs had few enough &ldquo;rules&rdquo; that the some of the more important ones could be shown on a simple index card. Not all machines will have one, though, since they often got lost or damaged over the years. When they are present, they&rsquo;ll give you partial guidance as to what to do but are usually not as detailed as this guide nor do they indicate which of the several choices are the most valuable or the &ldquo;safest.&rdquo;</p>
        <p>The instruction card you see in front of you may not accurately reflect how that machine is set. In many cases, the card will not be the original one, or it may reflect a different number of balls, for instance showing the rules that apply to a 5-ball game vs. a slightly different set of rules that apply to a 3-ball game. The card may be the rules for the &ldquo;other&rdquo; of the free-game or the add-a-ball version of the machine. Do not presume that the instruction card you see, if any, is 100% accurate for the game in front of you. Take it as a starting point but be sure to note what the game actually does as you play it -- ideally, by watching while someone else is playing!</p>
        <p>Both EMs and SS games also usually have lettering on the playfield surface that indicates scoring opportunities. It never hurts to &ldquo;read the machine&rdquo; when such text is present.</p>
      </div>
    ),
  },
  {
    title: 'Competition Format - Match Play or Head-to-Head vs. Best Game',
    content: (
      <div className="space-y-4">
        <p>Most of the games here have guidance to give you the best chance of achieving a good score. In many cases, though, there may be different strategies that are best for different situations. I refer to &ldquo;best game qualifying&rdquo; and &ldquo;card&rdquo; formats vs. head-to-head or group match play (2 to 4 players at a time) formats. In head-to-head and match play, you want to beat your immediate opponent(s). In this situation, a &ldquo;good but somewhat safe&rdquo; strategy is usually optimal. In &ldquo;best game qualifying&rdquo; formats, only your best score on a game will count; bad scores are ignored. For &ldquo;best game,&rdquo; you want to use a &ldquo;go for broke&rdquo; strategy with the highest possible outcome. In &ldquo;card&rdquo; format, your game will count as part of a set of 3-5 games played. In this case, you may want to go for broke if your games so far have been marginal or if it&rsquo;s your first or second game on the card, but perhaps play good-but-safe if you&rsquo;ve done well on your prior games on the card. I will be adding in notes on such differences as time permits.</p>
      </div>
    ),
  },
  {
    title: 'Stealing Locks',
    content: (
      <div className="space-y-4">
        <p>In head-to-head and match play, players compete simultaneously on the same machine. About a dozen games where you can &ldquo;lock&rdquo; a ball to prepare for multiball play are wired in a way that lets players unlock and play multiball with balls locked by someone else. This is referred to as &ldquo;lock stealing&rdquo; and should be taken into account as you play. Look to see if any balls locked by someone else are available to you; if so, take advantage of them! Besides the benefit to you if you do, if you don&rsquo;t, the player after you might take advantage instead.</p>
        <p><strong>Partial list of games with lock stealing:</strong></p>
        <ol className="list-decimal list-inside space-y-1 ml-4">
          <li>4 Million B.C.*</li>
          <li>Andromeda</li>
          <li>Big Valley*</li>
          <li>Capersville*</li>
          <li>Fathom*</li>
          <li>Fireball*</li>
          <li>Fireball Classic</li>
          <li>Grand Lizard</li>
          <li>Jokerz</li>
          <li>Nip-It*</li>
          <li>Sorceror</li>
          <li>Space Shuttle</li>
          <li>Vector</li>
        </ol>
        <p className="text-sm text-gray-600">Games with an asterisk are ones where the locked balls stay in the locks between games, i.e. you can walk up to start a game and find it already has one or more balls locked.</p>
        <p>There&rsquo;s a lesser version of this, too: games which remember which player locked how many balls but where when one player plays multiball, the balls are all released. Any other players who earned locks must then physically relock the balls for any locks they earned.</p>
        <p><strong>Partial list (lesser lock stealing):</strong></p>
        <ol className="list-decimal list-inside space-y-1 ml-4">
          <li>Black Hole</li>
          <li>Cosmic Gunfight</li>
          <li>Firepower</li>
          <li>Firepower II</li>
          <li>Monte Carlo (Gottlieb)</li>
          <li>Nine Ball</li>
          <li>Scorpion</li>
        </ol>
      </div>
    ),
  },
  {
    title: 'Historical Commentary',
    content: (
      <div className="space-y-4">
        <p>First, let&rsquo;s look at how many games made it into my guide by year. Until the late 1960&rsquo;s, most games involved relatively little skill, so few from this period are represented even though actual production numbers were often high. Most of those games are long since discarded. The first year with more than five machines here is 1968 with 9 titles. The numbers grow from there, reaching 31-34 games each year from 1977 through 1980, then rapidly declining. The most noticeable change is the sharp drop off from 33 in 1980 to just 15 in 1981. 1980-1981 was when the first big video game wave hit, PacMan in 1980 in particular. Pinball machines were suddenly the #2 game in town.</p>
        <p>People often ask me what my favorite games are. That&rsquo;s hard to answer, since I favor some for their &ldquo;fun-ness&rdquo; and others for their &ldquo;skill-ness.&rdquo; Unlike some websites (e.g. IPDB), I give almost no weight to artwork or sound in this regard. Below are my Top 50 Classic Games; I do take the state of the art at the time the game was produced into account. My EM and SS Top Tens come with an asterisk.</p>
        <p>While I don&rsquo;t have a &ldquo;favorite game,&rdquo; I do have a &ldquo;Favorite Year&rdquo;: <strong>1980</strong>. It was an exceptional year in terms of the number of high-quality games produced. No year before or since had as many tournament-worthy titles made. Pinball &ldquo;peaked&rdquo; this year in many ways, just as the video game craze was about to overtake it. Other noteworthy 1980 titles in this guide include Asteroid Annie, Cheetah, Counterforce, Panthera, Quicksilver, Scorpion, Spiderman and Xenon. 1980 was also easily the best year for wide-body machines with 11 in this guide. If you stranded me on a desert island (with power!) with a choice of games from only 1 year to have available, it&rsquo;s no contest.</p>

        <h4 className="font-bold text-[var(--dark-green)] mt-6">Top 50 Classic Games - Electro-Mechanical</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <tbody>
              <tr><td className="py-1 pr-4">1968</td><td>Royal Guard</td></tr>
              <tr><td className="py-1 pr-4">1969</td><td>Target Pool - best stand-up target game*</td></tr>
              <tr><td className="py-1 pr-4">1970</td><td>Doodle Bug - best no-cradling game*</td></tr>
              <tr><td className="py-1 pr-4">1972</td><td>Fireball - best zipper flipper game*</td></tr>
              <tr><td className="py-1 pr-4">1973</td><td>High Hand</td></tr>
              <tr><td className="py-1 pr-4">1973</td><td>Jack in the Box</td></tr>
              <tr><td className="py-1 pr-4">1973</td><td>Time Zone</td></tr>
              <tr><td className="py-1 pr-4">1974</td><td>Sky Jump - best mix of lanes and targets*</td></tr>
              <tr><td className="py-1 pr-4">1975</td><td>Abra Ca Dabra*</td></tr>
              <tr><td className="py-1 pr-4">1975</td><td>El Dorado - best for dead bounce and long precise shot training*</td></tr>
              <tr><td className="py-1 pr-4">1976</td><td>Flip Flop - most interesting playfield layout*</td></tr>
              <tr><td className="py-1 pr-4">1976</td><td>Grand Prix - best spinner game*</td></tr>
              <tr><td className="py-1 pr-4">1976</td><td>Volley*</td></tr>
              <tr><td className="py-1 pr-4">1977</td><td>Centigrade 37</td></tr>
              <tr><td className="py-1 pr-4">1977</td><td>Jacks Open</td></tr>
              <tr><td className="py-1 pr-4">1977</td><td>Jungle Queen - best use of two-tier flippers*</td></tr>
            </tbody>
          </table>
        </div>

        <h4 className="font-bold text-[var(--dark-green)] mt-6">Top 50 Classic Games - Solid State</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <tbody>
              <tr><td className="py-1 pr-4">1978</td><td>Sinbad - best double flipper, plus bonus multiplier / drop target rules*</td></tr>
              <tr><td className="py-1 pr-4">1978</td><td>Joker Poker - best drop target game*</td></tr>
              <tr><td className="py-1 pr-4">1978</td><td>Stars - best use of Special</td></tr>
              <tr><td className="py-1 pr-4">1979</td><td>Flash</td></tr>
              <tr><td className="py-1 pr-4">1979</td><td>Harlem Globetrotters - best in-line target game*</td></tr>
              <tr><td className="py-1 pr-4">1979</td><td>Magic</td></tr>
              <tr><td className="py-1 pr-4">1979</td><td>Meteor - best drop-target-plus-spinner game*</td></tr>
              <tr><td className="py-1 pr-4">1979</td><td>Paragon - #2 widebody, #2 in-line target game</td></tr>
              <tr><td className="py-1 pr-4">1980</td><td>Ali</td></tr>
              <tr><td className="py-1 pr-4">1980</td><td>Alien Poker</td></tr>
              <tr><td className="py-1 pr-4">1980</td><td>Big Game - best use of double flippers</td></tr>
              <tr><td className="py-1 pr-4">1980</td><td>Black Knight - best use of two playfield levels*</td></tr>
              <tr><td className="py-1 pr-4">1980</td><td>Blackout</td></tr>
              <tr><td className="py-1 pr-4">1980</td><td>Firepower</td></tr>
              <tr><td className="py-1 pr-4">1980</td><td>Frontier - best use of collect bonus</td></tr>
              <tr><td className="py-1 pr-4">1980</td><td>HotDoggin&apos; - best widebody</td></tr>
              <tr><td className="py-1 pr-4">1980</td><td>Mystic</td></tr>
              <tr><td className="py-1 pr-4">1980</td><td>Nine Ball</td></tr>
              <tr><td className="py-1 pr-4">1980</td><td>Sea Witch</td></tr>
              <tr><td className="py-1 pr-4">1980</td><td>Skateball - best blend of ball control and strategy*</td></tr>
              <tr><td className="py-1 pr-4">1980</td><td>Star Gazer</td></tr>
              <tr><td className="py-1 pr-4">1980</td><td>Viking</td></tr>
              <tr><td className="py-1 pr-4">1981</td><td>Barracora - most interesting multiball rules</td></tr>
              <tr><td className="py-1 pr-4">1981</td><td>Centaur - best multiball game*</td></tr>
              <tr><td className="py-1 pr-4">1981</td><td>Eight Ball Deluxe</td></tr>
              <tr><td className="py-1 pr-4">1981</td><td>Fathom</td></tr>
              <tr><td className="py-1 pr-4">1981</td><td>Flash Gordon - best variety of progressive scoring*</td></tr>
              <tr><td className="py-1 pr-4">1981</td><td>Medusa</td></tr>
              <tr><td className="py-1 pr-4">1981</td><td>Pharaoh</td></tr>
              <tr><td className="py-1 pr-4">1982</td><td>Warlok - best blend of target / orbit / collect bonus shots*</td></tr>
              <tr><td className="py-1 pr-4">1983</td><td>Time Fantasy - best use of time as a score element</td></tr>
              <tr><td className="py-1 pr-4">1984</td><td>Alien Star - best &ldquo;no lead is safe&rdquo; game</td></tr>
              <tr><td className="py-1 pr-4">1984</td><td>Laser Cue - best blend of shot variety and precision*</td></tr>
              <tr><td className="py-1 pr-4">1985</td><td>Andromeda</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
  {
    title: 'Classics Competitions - A Brief Event History',
    content: (
      <div className="space-y-4">
        <p>There were occasional events in the 1970&rsquo;s, most run by either individual arcade locations or in a few cases by branches of the AMOA (Amusement Machine Operators of America). All but a handful were held in regular arcades. In the AMOA case, they sometimes had location-based tiers: win your individual arcade location to qualify for a regional event, win that to qualify for a statewide event. A few attempts at creating something more permanent were tried, like the &ldquo;World Pinball Association&rdquo; that held championships in D.C. in 1972 and 1973 and the &ldquo;American Pinball Association&rdquo; that ran the US Open in 1980, but none persisted. Player-organized events were rare. The tournament director(s) would never be participants; they were operators or owners, not players.</p>
        <p>The most common format for events in those days was qualifying across multiple games based on position points followed by playoffs on only one or just a few games. For qualifying, the arcade would select some portion of their games for use, and players would get points for being among the top 10 scores on each game. Sometimes you got one try, sometimes multiple tries, once in a while unlimited tries over a week or month. A typical point scheme would be 15-12-10-8-6-5-4-3-2-1. The top 8 or 16 or 25 players - - the number of qualifiers varied - - would be instructed to return for the playoffs on a designated date if the event took more than one day. Playoffs were sometimes head to head, sometimes ranked scores across either several machines or one machine with multiple tries on it totaled, sometimes both, e.g. narrow it down to the top 4 with a fresh ranked score round, then have the top four play in the finals. One major difference with today is that the players never got to choose what machines to play. They generally didn&rsquo;t get to choose position, either, that being fixed based on their qualifying rank - - you played in reverse qualifying order, high qualifier last.</p>
        <p>For a few events, the qualifying phase was simply &ldquo;get the high score on one of the games here.&rdquo; All the high score people would then play one or more games on a designated finals machine, in random order on the first pass, highest total to date last on multiple passes. Your total score for the (one or more) games of the finals determined your order of finish. The 1980 US Open used this format.</p>
        <p>Prizes were generally modest, since most events had little or no entry fee, you just paid the coin drop to play the games and maybe $5 or $10 in some cases to register. A typical single-location event would have either zero or a $5 fee and a top prize of perhaps $100. A state-level AMOA event would give away a new machine to the winner, such as a Bally Wizard in 1975. The 1980 US Open was a rare exception with a $10 per game entry fee and a first prize of a then-huge $5,000 (a new car in 1980 cost a bit over $7,000). It&rsquo;s been over 40 years, and I don&rsquo;t think there&rsquo;s been a significant event since then where the price-per-game of an entry has been more than $10, and that&rsquo;s without taking inflation into account! Today&rsquo;s &ldquo;High Stakes&rdquo; events are charging exactly $10 per game played.</p>
        <p>An interesting bit of trivia here relates to &ldquo;plunging off.&rdquo; In modern events, if the last player has already scored more prior to playing their last ball than any of the other players scored for their completed games, that player can &ldquo;plunge off&rdquo; ball 3 (or ball 5 for an EM machine) since they don&rsquo;t need any points on their last ball to win. In these earlier events where you totaled the scores or points across multiple games, it was possible for a player to in essence &ldquo;plunge off&rdquo; their entire final game if their accumulated score or point total already exceeded that of all other players. While this can still be done now in some formats, e.g. when using PAPA-points, the winning player&rsquo;s score in the final game today can still impact where other players finish, so plunging off their last game is discouraged. That was not a problem in these earlier events where everyone&rsquo;s finishing position would already be known using this format in such cases.</p>
        <p>Tournament &ldquo;rulings&rdquo; were relatively rare; what happened, happened. If the ball got stuck, you were expected to try to nudge it loose unless it was in a really gnarly spot; in that case, yes the glass would be removed, but the ball was then usually placed in the plunger lane for simplicity. Compensation balls? I don&rsquo;t recall encountering a compensation ball prior to the 1990&rsquo;s. Tilt-throughs were automatic losses. Extra balls, if earned, were always played, never plunged. Some games had ball counts that went as high as 10; Gold Strike, the add-a-ball version of El Dorado, is one. The game starts you with 5, but you can build that up as high as 10, play it back down, then build it up again. You got to play whatever you earned. Games would play as arcade-normal most of the time; in rare cases, they might tighten the tilt. There were no &ldquo;tournament settings&rdquo; nor removal of posts, rubbers, etc.</p>
      </div>
    ),
  },
  {
    title: 'Machine Etiquette',
    content: (
      <div className="space-y-4">
        <p>When you encounter these games today, treat them with respect. They&rsquo;re probably older than you are, and certainly have seen a lot of wear and tear over the years. Even if restored, they&rsquo;re vulnerable to damage and breakdowns. Whoever has brought the game to a show, tournament, or placed it in an arcade deserves to have their property, put there for your enjoyment and that of the people who come after you, played nicely. If your game ends sooner than you wanted, don&rsquo;t abuse it. If the machine does something it&rsquo;s not supposed to, let someone know. If the ball gets stuck, nudge it but don&rsquo;t thrash the machine around to free it, get a technician to help. As Rudy from Funhouse would say, <strong>&ldquo;Hey, it&rsquo;s only pinball!&rdquo;</strong></p>
      </div>
    ),
  },
]

function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="space-y-2 print:space-y-4">
      {items.map((item, index) => (
        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden print:border-0 print:border-b print:rounded-none">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left print:bg-transparent print:p-0 print:pb-2"
          >
            <span className="font-semibold text-[var(--dark-green)]">{item.title}</span>
            <span className="print:hidden">
              {openIndex === index ? (
                <ChevronUp size={20} className="text-gray-500 flex-shrink-0" />
              ) : (
                <ChevronDown size={20} className="text-gray-500 flex-shrink-0" />
              )}
            </span>
          </button>
          <div className={`p-4 text-gray-700 print:block print:p-0 print:pt-2 ${openIndex === index ? 'block' : 'hidden'}`}>
            {item.content}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function GuidePage() {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--dark-green)] mb-2">
            Bob&apos;s Guide to Pinball
          </h1>
          <p className="text-gray-600">
            Tips, strategies, and techniques for classic pinball machines.
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors print:hidden"
          title="Print Guide"
        >
          <Printer size={20} className="text-gray-600" />
        </button>
      </div>

      <Accordion items={guideContent} />

    </div>
  )
}
