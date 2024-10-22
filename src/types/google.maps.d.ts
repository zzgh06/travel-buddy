declare namespace google {
  namespace maps {
    namespace places {
      class AutocompleteService {
        getPlacePredictions(
          request: AutocompletionRequest,
          callback: (results: AutocompletePrediction[] | null, status: PlacesServiceStatus) => void
        ): void;
      }

      class PlacesService {
        constructor(attrContainer: HTMLDivElement | Map);
        getDetails(
          request: PlaceDetailsRequest,
          callback: (result: PlaceResult | null, status: PlacesServiceStatus) => void
        ): void;
      }

      interface AutocompletePrediction {
        description: string;
        place_id: string;
        structured_formatting: {
          main_text: string;
          main_text_matched_substrings: Array<PredictionSubstring>;
          secondary_text: string;
        };
        types: string[];
        matched_substrings: Array<PredictionSubstring>;
        terms: Array<PredictionTerm>;
      }

      interface PredictionSubstring {
        offset: number;
        length: number;
      }

      interface PredictionTerm {
        offset: number;
        value: string;
      }

      interface AutocompleteRequest {
        input: string;
        bounds?: LatLngBounds | LatLngBoundsLiteral;
        componentRestrictions?: ComponentRestrictions;
        location?: LatLng | LatLngLiteral;
        offset?: number;
        origin?: LatLng | LatLngLiteral;
        radius?: number;
        sessionToken?: AutocompleteSessionToken;
        types?: string[];
      }

      interface PlaceDetailsRequest {
        placeId: string;
        fields?: string[];
        sessionToken?: AutocompleteSessionToken;
      }

      interface PlaceResult {
        name?: string;
        geometry?: {
          location?: LatLng;
        };
      }

      enum PlacesServiceStatus {
        OK,
        ZERO_RESULTS,
        OVER_QUERY_LIMIT,
        REQUEST_DENIED,
        INVALID_REQUEST,
      }
      
      class AutocompleteSessionToken {}
    }
  }
}