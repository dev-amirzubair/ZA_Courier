import type {
  AddressRef,
  PricingEngineConfig,
  QuotePackageInput,
  QuoteRequest,
  RouteMatcher,
  ServiceRateRule,
  ZoneDefinition,
} from "@/types/pricing";

export function resolveZones(
  address: AddressRef,
  zones: ZoneDefinition[],
): ZoneDefinition[] {
  const postcode = address.postcode;
  const state = address.state.toUpperCase();

  return zones.filter((zone) => {
    if (zone.states?.map((s) => s.toUpperCase()).includes(state)) {
      return true;
    }

    if (zone.postcodes?.includes(postcode)) {
      return true;
    }

    if (
      zone.postcodePrefixes?.some((prefix) => postcode.startsWith(prefix))
    ) {
      return true;
    }

    return false;
  });
}

export function isRemoteDestination(
  destination: AddressRef,
  config: PricingEngineConfig,
): boolean {
  const zones = resolveZones(destination, config.zones);
  if (zones.some((zone) => zone.remote)) {
    return true;
  }

  return config.remotePostcodePrefixes.some((prefix) =>
    destination.postcode.startsWith(prefix),
  );
}

function matchesPrefixList(
  postcode: string,
  prefixes: string[] | undefined,
): boolean {
  if (!prefixes || prefixes.length === 0) {
    return true;
  }

  return prefixes.some((prefix) => postcode.startsWith(prefix));
}

function matchesStateList(
  state: string,
  states: string[] | undefined,
): boolean {
  if (!states || states.length === 0) {
    return true;
  }

  return states.map((s) => s.toUpperCase()).includes(state.toUpperCase());
}

function matchesZoneList(
  addressZones: ZoneDefinition[],
  zoneIds: string[] | undefined,
): boolean {
  if (!zoneIds || zoneIds.length === 0) {
    return true;
  }

  const ids = new Set(addressZones.map((zone) => zone.id));
  return zoneIds.some((id) => ids.has(id));
}

export function routeMatches(
  matcher: RouteMatcher,
  origin: AddressRef,
  destination: AddressRef,
  config: PricingEngineConfig,
): boolean {
  const originZones = resolveZones(origin, config.zones);
  const destinationZones = resolveZones(destination, config.zones);
  const sameState =
    origin.state.toUpperCase() === destination.state.toUpperCase();

  if (matcher.sameState === true && !sameState) {
    return false;
  }

  if (matcher.interstate === true && sameState) {
    return false;
  }

  if (!matchesStateList(origin.state, matcher.originStates)) {
    return false;
  }

  if (!matchesStateList(destination.state, matcher.destinationStates)) {
    return false;
  }

  if (!matchesPrefixList(origin.postcode, matcher.originPostcodePrefixes)) {
    return false;
  }

  if (
    !matchesPrefixList(
      destination.postcode,
      matcher.destinationPostcodePrefixes,
    )
  ) {
    return false;
  }

  if (!matchesZoneList(originZones, matcher.originZones)) {
    return false;
  }

  if (!matchesZoneList(destinationZones, matcher.destinationZones)) {
    return false;
  }

  return true;
}

export function packageTypesAllowed(
  rule: ServiceRateRule,
  packages: QuotePackageInput[],
): boolean {
  if (rule.packageTypes === "*") {
    return true;
  }

  return packages.every((pkg) => rule.packageTypes.includes(pkg.packageType));
}

export function findMatchingRules(
  request: QuoteRequest,
  config: PricingEngineConfig,
): ServiceRateRule[] {
  return config.rules
    .filter((rule) => rule.active)
    .filter((rule) => packageTypesAllowed(rule, request.packages))
    .filter((rule) =>
      routeMatches(rule.route, request.origin, request.destination, config),
    )
    .filter((rule) => {
      if (!request.preferredServiceLevels?.length) {
        return true;
      }

      return request.preferredServiceLevels.includes(rule.serviceLevel);
    })
    .sort((a, b) => a.priority - b.priority);
}

export function formatDeliveryLabel(
  minBusinessDays: number,
  maxBusinessDays: number,
): string {
  if (minBusinessDays === 0 && maxBusinessDays === 0) {
    return "Same day";
  }

  if (minBusinessDays === maxBusinessDays) {
    if (minBusinessDays === 1) {
      return "Next business day";
    }

    return `${minBusinessDays} business days`;
  }

  return `${minBusinessDays}–${maxBusinessDays} business days`;
}
