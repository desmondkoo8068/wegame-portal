"use client";
/**
 * LocaleModal: "地区与货币" – detect the visitor's location with the
 * Geolocation API and show prices in their local currency (bonus feature).
 *
 * Built on the native <dialog> element: showModal() gives us a backdrop,
 * focus trapping, Escape-to-close and correct screen-reader semantics
 * without any library. Open/closed lives in Redux (ui.isLocaleModalOpen)
 * because the buttons that open it are in other components.
 *
 * Every step of the async flow has its own UI:
 *   idle -> "使用我的位置" button
 *   loading -> spinner + "allow location in the browser prompt"
 *   succeeded -> country, currency, exchange rate (with its own loading/error)
 *   failed -> specific message per error code + retry
 * A manual currency picker is always available as a fallback.
 */
import { useEffect, useRef } from "react";
import Price from "@/components/ui/Price";
import ErrorState from "@/components/ui/ErrorState";
import { CloseIcon, LocateIcon } from "@/components/ui/Icons";
import { BASE_CURRENCY, manualCurrencies } from "@/data/currencies";
import { countryName, currencyName } from "@/lib/format";
import { flagEmoji, type GeoErrorCode } from "@/lib/geo";
import { useGames } from "@/lib/useGames";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectAllGames } from "@/store/slices/gamesSlice";
import {
  detectLocation,
  fetchRates,
  selectDisplayCurrency,
  selectGeo,
  setCurrency,
} from "@/store/slices/geoSlice";
import { closeLocaleModal } from "@/store/slices/uiSlice";

/** What the visitor can do about each failure. */
const errorHints: Record<GeoErrorCode, string> = {
  UNSUPPORTED: "请使用最新版浏览器，并通过 HTTPS 访问本站。你也可以在下方手动选择货币。",
  PERMISSION_DENIED: "请点击地址栏左侧的图标，允许本站使用位置信息后重试，或在下方手动选择货币。",
  POSITION_UNAVAILABLE: "请检查设备的定位服务是否开启，然后重试。",
  TIMEOUT: "网络或定位信号较弱，请稍后重试。",
  LOOKUP_FAILED: "位置查询服务暂时不可用，请稍后重试或手动选择货币。",
};

export default function LocaleModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isLocaleModalOpen);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Keep the real <dialog> in sync with Redux.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
    // showModal() doesn't stop the page behind from scrolling; do it here.
    document.documentElement.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="locale-title"
      // Fires for Escape, the close button and backdrop clicks alike.
      onClose={() => dispatch(closeLocaleModal())}
      // A click whose target is the <dialog> itself landed on the backdrop.
      onClick={(event) => event.target === event.currentTarget && dialogRef.current?.close()}
      className="m-auto max-h-[90svh] w-[min(92vw,440px)] overflow-y-auto rounded-xl border border-line bg-surface p-0 text-white shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      {/* Only render the content while open, so effects/fetches inside don't run hidden. */}
      {isOpen && (
        <div className="flex flex-col gap-5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="locale-title" className="text-lg font-bold">
                地区与货币
              </h2>
              <p className="mt-1 text-sm text-muted">根据你的位置，自动以本地货币显示游戏价格。</p>
            </div>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="关闭"
              className="-mr-2 -mt-1 rounded p-2 text-white/60 hover:bg-white/10 hover:text-white"
            >
              <CloseIcon />
            </button>
          </div>

          <DetectionPanel />
          <ManualPicker />
          <PricePreview />

          <p className="text-[11px] leading-relaxed text-white/40">
            坐标会先四舍五入到约 1
            公里，仅用于查询所在国家或地区，不会被保存。位置查询：BigDataCloud；汇率：open.er-api.com（每日更新）。
          </p>
        </div>
      )}
    </dialog>
  );
}

/** The geolocation flow: button → spinner → result or error. */
function DetectionPanel() {
  const dispatch = useAppDispatch();
  const geo = useAppSelector(selectGeo);
  const detect = () => dispatch(detectLocation());

  return (
    // aria-live: screen readers announce each status change automatically.
    <section aria-live="polite" className="rounded-lg border border-line bg-page/60 p-4">
      {geo.status === "idle" && (
        <button type="button" onClick={detect} className="btn-primary w-full py-3">
          <LocateIcon width={18} height={18} />
          使用我的位置
        </button>
      )}

      {geo.status === "loading" && (
        <div className="flex items-center gap-3" role="status">
          <span className="size-5 shrink-0 animate-spin rounded-full border-2 border-white/20 border-t-brand" />
          <div>
            <p className="font-bold">正在获取你的位置…</p>
            <p className="text-xs text-muted">如果浏览器弹出提示，请选择“允许”。</p>
          </div>
        </div>
      )}

      {geo.status === "failed" && geo.error && (
        <ErrorState
          title={geo.error.message}
          message={errorHints[geo.error.code]}
          // Retrying "unsupported" can't succeed, so don't offer it.
          onRetry={geo.error.code === "UNSUPPORTED" ? undefined : detect}
          className="border-none bg-transparent p-0"
        />
      )}

      {geo.status === "succeeded" && geo.countryCode && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl leading-none" aria-hidden="true">
              {flagEmoji(geo.countryCode)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-bold">
                {countryName(geo.countryCode)}
                {geo.approximate && (
                  <span className="ml-2 text-xs font-normal text-muted">（大致位置）</span>
                )}
              </p>
              <p className="text-sm text-muted">
                本地货币：{currencyName(geo.currency)}（{geo.currency}）
              </p>
            </div>
            <button
              type="button"
              onClick={detect}
              className="shrink-0 text-xs font-bold text-brand hover:underline"
            >
              重新检测
            </button>
          </div>
          <RateLine />
        </div>
      )}
    </section>
  );
}

/** "1 人民币 = 0.6136 MYR", with its own loading and error states. */
function RateLine() {
  const dispatch = useAppDispatch();
  const { currency, rates } = useAppSelector(selectGeo);

  if (currency === BASE_CURRENCY) {
    return <p className="text-xs text-muted">价格以人民币显示，无需换算。</p>;
  }
  if (rates.status === "failed") {
    return (
      <p className="flex flex-wrap items-center gap-x-3 text-xs text-red-300">
        {rates.error}
        <button
          type="button"
          onClick={() => dispatch(fetchRates())}
          className="font-bold text-brand hover:underline"
        >
          重试
        </button>
      </p>
    );
  }
  const rate = rates.table?.[currency];
  if (!rate) return <div className="skeleton h-4 w-48" aria-label="正在加载汇率" />;

  return (
    <p className="text-xs text-muted">
      1 人民币 = {rate.toLocaleString("zh-CN", { maximumSignificantDigits: 5 })} {currency}
      {rates.updatedAt && <> · 更新于 {new Date(rates.updatedAt).toLocaleDateString("zh-CN")}</>}
    </p>
  );
}

/** Always-available fallback: choose a currency by hand. */
function ManualPicker() {
  const dispatch = useAppDispatch();
  const currency = useAppSelector((state) => state.geo.currency);

  // Make sure the detected currency is in the list even if it's uncommon.
  const options = manualCurrencies.includes(currency)
    ? manualCurrencies
    : [currency, ...manualCurrencies];

  return (
    <label className="flex items-center justify-between gap-3 text-sm">
      <span className="text-muted">或手动选择货币</span>
      <select
        value={currency}
        onChange={(event) => {
          dispatch(setCurrency(event.target.value));
          dispatch(fetchRates()); // no-op if the table is already loaded
        }}
        className="max-w-[60%] rounded border border-line bg-raised px-3 py-2 text-white focus:border-brand focus:outline-none"
      >
        {options.map((code) => (
          <option key={code} value={code}>
            {code} · {currencyName(code)}
          </option>
        ))}
      </select>
    </label>
  );
}

/** A few real games priced in the chosen currency, to show the effect. */
function PricePreview() {
  const { status, retry } = useGames();
  const games = useAppSelector(selectAllGames);
  const { converted } = useAppSelector(selectDisplayCurrency);
  // Paid games first (they show the conversion), then one free game.
  const preview = [
    ...games.filter((game) => game.priceCny > 0),
    ...games.filter((game) => game.priceCny === 0).slice(0, 1),
  ];

  return (
    <section aria-labelledby="price-preview-title">
      <h3 id="price-preview-title" className="mb-2 text-sm font-bold">
        价格预览 {converted && <span className="font-normal text-muted">（括号内为原价）</span>}
      </h3>
      {status === "failed" ? (
        <ErrorState compact message="游戏列表加载失败" onRetry={retry} />
      ) : status !== "succeeded" ? (
        <div className="flex flex-col gap-2" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton h-9" />
          ))}
        </div>
      ) : (
        <ul className="divide-y divide-line rounded-lg border border-line">
          {preview.map((game) => (
            <li key={game.id} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
              <span className="truncate">{game.title}</span>
              <Price priceCny={game.priceCny} className="shrink-0" />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
