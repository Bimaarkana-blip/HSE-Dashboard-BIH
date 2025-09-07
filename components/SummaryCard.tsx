<div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
  {/* APAR */}
  <div className="rounded-xl border bg-white p-5">
    <h3 className="mb-2 text-lg font-semibold">APAR</h3>
    <p className="text-sm">Total: {tallies.apar}</p>
    <p className="text-sm">Powder: {tallies.aparPowder}</p>
    <p className="text-sm">CO2: {tallies.aparCo2}</p>
    <p className="text-sm">Water Mist: {tallies.aparMist}</p>
  </div>

  {/* HIDRAN */}
  <div className="rounded-xl border bg-white p-5">
    <h3 className="mb-2 text-lg font-semibold">HIDRAN</h3>
    <p className="text-sm">Total: {tallies.hidran}</p>
    <p className="text-sm">Indoor: {tallies.hidranIndoor}</p>
    <p className="text-sm">Outdoor: {tallies.hidranOutdoor}</p>
  </div>

  {/* DETECTOR */}
  <div className="rounded-xl border bg-white p-5">
    <h3 className="mb-2 text-lg font-semibold">DETECTOR</h3>
    <p className="text-sm">Total: {tallies.detector}</p>
    <p className="text-sm">Smoke: {tallies.detSmoke}</p>
    <p className="text-sm">Heat: {tallies.detHeat}</p>
    <p className="text-sm">Beam: {tallies.detBeam}</p>
  </div>

  {/* SPRINKLER */}
  <div className="rounded-xl border bg-white p-5">
    <h3 className="mb-2 text-lg font-semibold">SPRINKLER</h3>
    <p className="text-sm">Total: {tallies.sprinkler}</p>
  </div>

  {/* KOTAK P3K */}
  <div className="rounded-xl border bg-white p-5">
    <h3 className="mb-2 text-lg font-semibold">KOTAK P3K</h3>
    <p className="text-sm">Total: {tallies.p3k}</p>
    <p className="text-sm">Tipe A: –</p>
    <p className="text-sm">Tipe B: –</p>
    <p className="text-sm">Tipe C: –</p>
  </div>
</div>