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
        constructor(attrContainer: HTMLDivElement);
        getDetails(
          request: PlaceDetailsRequest,
          callback: (result: PlaceResult | null, status: PlacesServiceStatus) => void
        ): void;
      }

      interface AutocompletePrediction {
        description: string;
        place_id: string;
      }

      interface AutocompletionRequest {
        input: string;
        types?: string[];
      }

      interface PlaceDetailsRequest {
        placeId: string;
        fields: string[];
      }

      interface PlaceResult {
        name?: string;
        geometry?: {
          location?: {
            lat(): number;
            lng(): number;
          };
        };
      }

      enum PlacesServiceStatus {
        OK,
        ZERO_RESULTS,
        OVER_QUERY_LIMIT,
        REQUEST_DENIED,
        INVALID_REQUEST,
      }
    }
  }
}