/**
 * Central Type Exports
 *
 * Re-exports all TypeScript types for convenient importing
 * @module types
 */

// Common types
export type {
  ID,
  Status,
  HttpMethod,
  Optional,
  RequiredFields,
  DeepPartial,
  ArrayElement,
  NonNullable as NonNullableType,
  AsyncFunction,
  BaseProps,
  WithLoadingState,
  WithErrorState,
  WithDisabledState,
  ComponentProps,
  ApiResponse,
  ApiError,
  PaginatedResponse,
  QueryParams,
  Coordinates,
  Location,
  BoundingBox,
  FieldError,
  ValidationResult,
  FormSubmitHandler,
  CustomEvent,
  EventHandler,
  AsyncState,
  PerformanceMetric,
  RenderInfo,
  EnvironmentConfig,
  FeatureFlags,
} from './common';

export {
  AppError,
  NetworkError,
  ValidationError,
  isDefined,
  isString,
  isNumber,
  isObject,
  isArray,
  isAppError,
  isNetworkError,
  isValidationError,
  createAsyncState,
} from './common';

// Station types
export {
  FuelType,
  StationCategory,
  PriceTrend,
} from './station';

export type {
  FuelTypeKey,
  FuelTypeValue,
  StationBrand,
  StationAmenities,
  OperatingHours,
  BaseStation,
  StationWithLocation,
  Station,
  FuelPrice,
  StationWithPrices,
  StationFilters,
  StationSortBy,
  StationSearchParams,
  StationSearchResult,
  StationMarker,
  MapViewport,
  MapBounds,
  StationViewEvent,
  PriceComparisonEvent,
  BaserowStationResponse,
  BaserowFuelPriceResponse,
} from './station';

export {
  isFuelType,
  isStation,
  isStationWithPrices,
  getFuelTypeDisplayName,
  formatPrice,
  calculateDistance,
} from './station';

// Component types (renamed to avoid conflicts with existing components)
export type {
  Size,
  Variant,
  ColorScheme,
  Alignment,
  Position,
  AccessibilityProps,
  ButtonProps as ButtonPropsNew,
  LinkProps,
  InputProps as InputPropsNew,
  SelectProps,
  SelectOption,
  TextareaProps,
  CheckboxProps,
  CardProps as CardPropsNew,
  BadgeProps as BadgePropsNew,
  ModalProps,
  TooltipProps,
  AlertProps as AlertPropsNew,
  ContainerProps,
  StackProps,
  GridProps,
  TableProps,
  TableColumn,
  ListProps,
  SpinnerProps as SpinnerPropsNew,
  ProgressProps,
  SkeletonProps,
  TabsProps,
  TabItem,
  BreadcrumbProps,
  BreadcrumbItem,
  WithStyle,
  WithRef,
  WithDataAttributes,
  PolymorphicProps,
  ExtractProps,
  WithChildren,
  ComponentRef,
} from './component';

// Legacy types for backward compatibility
export type {
  PetrolStation,
  SearchFilters,
  SortOption,
  GeolocationState,
  ColorVariant,
  InteractiveProps,
} from './legacy';

// Re-export commonly used React types
export type {
  FC as FunctionComponent,
  PropsWithChildren,
  ReactNode,
  ReactElement,
  ComponentType,
  ComponentProps as ReactComponentProps,
  CSSProperties,
  MouseEvent,
  ChangeEvent,
  FocusEvent,
  FormEvent,
  KeyboardEvent,
} from 'react';
